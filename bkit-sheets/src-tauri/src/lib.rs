mod licensing;

use licensing::LicenseStatus;

#[tauri::command]
fn get_machine_id() -> String {
    licensing::generate_machine_id()
}

#[tauri::command]
fn check_license_status() -> LicenseStatus {
    licensing::check_license_status()
}

#[tauri::command]
async fn activate_license(key: String) -> Result<LicenseStatus, String> {
    licensing::activate_license(key).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_machine_id,
            check_license_status,
            activate_license
        ])
        .run(tauri::generate_context!())
        .expect("Lỗi khi khởi chạy ứng dụng BKIT Sheets");
}
