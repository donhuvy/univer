use std::fs;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

const SECRET_SALT: &str = "BKIT_VN_SPREADSHEET_SECURE_SALT_2026_APACHE_2";

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct LicenseStatus {
    pub status: String, // "activated" | "trial" | "unactivated" | "expired"
    pub machine_id: String,
    pub license_key: Option<String>,
    pub customer_name: Option<String>,
    pub expires_at: Option<String>,
    pub message: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct StoredLicense {
    machine_id: String,
    license_key: String,
    customer_name: Option<String>,
    signature: String,
}

#[derive(Deserialize, Debug)]
struct LemonSqueezyResponse {
    valid: Option<bool>,
    error: Option<String>,
    license_key: Option<LemonLicenseKey>,
    meta: Option<LemonMeta>,
}

#[allow(dead_code)]
#[derive(Deserialize, Debug)]
struct LemonLicenseKey {
    status: Option<String>,
    expires_at: Option<String>,
}

#[derive(Deserialize, Debug)]
struct LemonMeta {
    customer_name: Option<String>,
}

/// Tạo mã định danh phần cứng máy tính (Machine Fingerprint)
pub fn generate_machine_id() -> String {
    let computer_name = std::env::var("COMPUTERNAME").unwrap_or_else(|_| "UNKNOWN_PC".to_string());
    let processor = std::env::var("PROCESSOR_IDENTIFIER").unwrap_or_else(|_| "CPU".to_string());
    let user_domain = std::env::var("USERDOMAIN").unwrap_or_else(|_| "DOMAIN".to_string());

    let raw_seed = format!("{}::{}:{}", computer_name, processor, user_domain);
    let mut hasher = Sha256::new();
    hasher.update(raw_seed.as_bytes());
    let hash = hex::encode(hasher.finalize());

    // Trả về dạng BKIT-XXXX-XXXX-XXXX
    let part1 = &hash[0..4].to_uppercase();
    let part2 = &hash[4..8].to_uppercase();
    let part3 = &hash[8..12].to_uppercase();
    let part4 = &hash[12..16].to_uppercase();

    format!("BKIT-{}-{}-{}-{}", part1, part2, part3, part4)
}

/// Đường dẫn tệp lưu trữ bản quyền %APPDATA%\BKIT\license.bin
fn get_license_file_path() -> Result<PathBuf, String> {
    let data_dir = dirs::data_dir().ok_or("Không thể xác định thư mục AppData hệ thống")?;
    let bkit_dir = data_dir.join("BKIT");
    if !bkit_dir.exists() {
        fs::create_dir_all(&bkit_dir).map_err(|e| format!("Không thể tạo thư mục BKIT: {}", e))?;
    }
    Ok(bkit_dir.join("license.bin"))
}

/// Tạo chữ ký chống sửa đổi (HMAC/SHA256)
fn compute_signature(machine_id: &str, license_key: &str) -> String {
    let raw = format!("{}:{}:{}", machine_id, license_key, SECRET_SALT);
    let mut hasher = Sha256::new();
    hasher.update(raw.as_bytes());
    hex::encode(hasher.finalize())
}

/// Kiểm tra trạng thái bản quyền từ tệp đã lưu trong máy
pub fn check_license_status() -> LicenseStatus {
    let machine_id = generate_machine_id();

    let path = match get_license_file_path() {
        Ok(p) => p,
        Err(_) => {
            return LicenseStatus {
                status: "unactivated".to_string(),
                machine_id,
                license_key: None,
                customer_name: None,
                expires_at: None,
                message: Some("Chưa kích hoạt".to_string()),
            }
        }
    };

    if !path.exists() {
        return LicenseStatus {
            status: "unactivated".to_string(),
            machine_id,
            license_key: None,
            customer_name: None,
            expires_at: None,
            message: Some("Chưa kích hoạt bản quyền".to_string()),
        };
    }

    let data = match fs::read_to_string(&path) {
        Ok(d) => d,
        Err(_) => {
            return LicenseStatus {
                status: "unactivated".to_string(),
                machine_id,
                license_key: None,
                customer_name: None,
                expires_at: None,
                message: Some("Không thể đọc tệp bản quyền".to_string()),
            }
        }
    };

    let stored: StoredLicense = match serde_json::from_str(&data) {
        Ok(s) => s,
        Err(_) => {
            return LicenseStatus {
                status: "unactivated".to_string(),
                machine_id,
                license_key: None,
                customer_name: None,
                expires_at: None,
                message: Some("Tệp bản quyền bị lỗi định dạng".to_string()),
            }
        }
    };

    // Kiểm tra tính toàn vẹn: Chữ ký phải khớp và Machine ID phải đúng máy này
    let expected_sig = compute_signature(&stored.machine_id, &stored.license_key);
    if stored.machine_id == machine_id && stored.signature == expected_sig {
        LicenseStatus {
            status: "activated".to_string(),
            machine_id,
            license_key: Some(stored.license_key),
            customer_name: stored.customer_name,
            expires_at: None,
            message: Some("Bản quyền thương mại hợp lệ".to_string()),
        }
    } else {
        LicenseStatus {
            status: "unactivated".to_string(),
            machine_id,
            license_key: None,
            customer_name: None,
            expires_at: None,
            message: Some("Chữ ký bản quyền không khớp với phần cứng máy tính".to_string()),
        }
    }
}

/// Kích hoạt bản quyền qua API Lemon Squeezy hoặc mã Developer
pub async fn activate_license(license_key: String) -> Result<LicenseStatus, String> {
    let key = license_key.trim();
    if key.is_empty() {
        return Err("Mã bản quyền không được để trống.".to_string());
    }

    let machine_id = generate_machine_id();

    // 1. Chế độ Developer / Offline Demo Key để kiểm thử nội bộ
    if key.starts_with("BKIT-DEMO-") || key == "BKIT-TEST-KEY-2026" {
        let sig = compute_signature(&machine_id, key);
        let stored = StoredLicense {
            machine_id: machine_id.clone(),
            license_key: key.to_string(),
            customer_name: Some("Khách hàng Demo BKIT".to_string()),
            signature: sig,
        };

        let path = get_license_file_path()?;
        let json_data = serde_json::to_string(&stored).map_err(|e| e.to_string())?;
        fs::write(path, json_data).map_err(|e| e.to_string())?;

        return Ok(LicenseStatus {
            status: "activated".to_string(),
            machine_id,
            license_key: Some(key.to_string()),
            customer_name: Some("Khách hàng Demo BKIT".to_string()),
            expires_at: None,
            message: Some("Kích hoạt bản quyền Demo thành công!".to_string()),
        });
    }

    // 2. Gọi API xác thực từ máy chủ Lemon Squeezy
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(12))
        .build()
        .map_err(|e| format!("Lỗi khởi tạo HTTP client: {}", e))?;

    let params = [
        ("license_key", key),
        ("instance_name", machine_id.as_str()),
    ];

    let res = client
        .post("https://api.lemonsqueezy.com/v1/licenses/validate")
        .form(&params)
        .send()
        .await
        .map_err(|e| format!("Không thể kết nối máy chủ Lemon Squeezy: {}", e))?;

    if !res.status().is_success() {
        return Err(format!("Máy chủ bản quyền trả về mã lỗi: {}", res.status()));
    }

    let json: LemonSqueezyResponse = res
        .json()
        .await
        .map_err(|e| format!("Lỗi phân giải phản hồi bản quyền: {}", e))?;

    if json.valid == Some(true) {
        let customer_name = json.meta.and_then(|m| m.customer_name);
        let sig = compute_signature(&machine_id, key);

        let stored = StoredLicense {
            machine_id: machine_id.clone(),
            license_key: key.to_string(),
            customer_name: customer_name.clone(),
            signature: sig,
        };

        let path = get_license_file_path()?;
        let json_data = serde_json::to_string(&stored).map_err(|e| e.to_string())?;
        fs::write(path, json_data).map_err(|e| format!("Không thể lưu tệp bản quyền: {}", e))?;

        let expires_at = json.license_key.and_then(|k| k.expires_at);

        Ok(LicenseStatus {
            status: "activated".to_string(),
            machine_id,
            license_key: Some(key.to_string()),
            customer_name,
            expires_at,
            message: Some("Kích hoạt thành công!".to_string()),
        })
    } else {
        let msg = json.error.unwrap_or_else(|| "Mã bản quyền không hợp lệ hoặc đã hết hạn.".to_string());
        Err(msg)
    }
}
