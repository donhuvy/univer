export interface LicenseInfo {
  status: 'activated' | 'trial' | 'unactivated' | 'expired';
  machine_id: string;
  license_key?: string;
  customer_name?: string;
  expires_at?: string;
  message?: string;
}

// Check if running inside Tauri window
export function isTauriEnvironment(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

// Invoke Tauri command safely with browser fallback for web preview
export async function invokeTauri<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (isTauriEnvironment()) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<T>(cmd, args);
  } else {
    // Browser Mock Mode for local web testing / preview
    console.warn(`[BKIT Licensing] Running in web preview fallback mode for command: ${cmd}`);
    if (cmd === 'get_machine_id') {
      let mockId = localStorage.getItem('bkit_mock_machine_id');
      if (!mockId) {
        mockId = 'BKIT-WEB-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        localStorage.setItem('bkit_mock_machine_id', mockId);
      }
      return mockId as unknown as T;
    }
    if (cmd === 'check_license_status') {
      const savedKey = localStorage.getItem('bkit_mock_key');
      const isTrial = localStorage.getItem('bkit_mock_trial') === 'true';
      const machineId = await invokeTauri<string>('get_machine_id');
      
      if (savedKey) {
        return {
          status: 'activated',
          machine_id: machineId,
          license_key: savedKey,
          customer_name: 'BKIT Commercial User',
          message: 'Bản quyền hợp lệ (Browser Preview)',
        } as unknown as T;
      }
      if (isTrial) {
        return {
          status: 'trial',
          machine_id: machineId,
          message: 'Đang dùng thử (Trial)',
        } as unknown as T;
      }
      return {
        status: 'unactivated',
        machine_id: machineId,
        message: 'Chưa kích hoạt',
      } as unknown as T;
    }
    if (cmd === 'activate_license') {
      const key = (args?.key as string || '').trim();
      const machineId = await invokeTauri<string>('get_machine_id');
      if (!key) {
        throw new Error('Vui lòng nhập mã bản quyền hợp lệ.');
      }
      // Simple mock rule for preview testing: Any key with 8+ chars or demo format
      if (key.length >= 8) {
        localStorage.setItem('bkit_mock_key', key);
        return {
          status: 'activated',
          machine_id: machineId,
          license_key: key,
          customer_name: 'Khách hàng BKIT',
          message: 'Kích hoạt thành công!',
        } as unknown as T;
      } else {
        throw new Error('Mã bản quyền không hợp lệ hoặc đã hết hạn.');
      }
    }
    throw new Error(`Unknown command: ${cmd}`);
  }
}

export class LicensingManager {
  private currentStatus: LicenseInfo = {
    status: 'unactivated',
    machine_id: '',
  };

  async init(): Promise<LicenseInfo> {
    try {
      this.currentStatus = await invokeTauri<LicenseInfo>('check_license_status');
    } catch (err) {
      console.error('Failed to check license status:', err);
      const machineId = await invokeTauri<string>('get_machine_id').catch(() => 'UNKNOWN');
      this.currentStatus = {
        status: 'unactivated',
        machine_id: machineId,
      };
    }

    this.updateUI();
    this.bindEvents();
    
    // Auto show modal if unactivated
    if (this.currentStatus.status === 'unactivated') {
      this.showModal();
    }
    
    return this.currentStatus;
  }

  getStatus(): LicenseInfo {
    return this.currentStatus;
  }

  showModal(): void {
    const modal = document.getElementById('modal-license');
    if (modal) modal.classList.remove('hidden');
    this.updateModalInfo();
  }

  hideModal(): void {
    const modal = document.getElementById('modal-license');
    if (modal) modal.classList.add('hidden');
  }

  private updateUI(): void {
    const btnLicense = document.getElementById('btn-license');
    const label = document.getElementById('license-label');
    if (!btnLicense || !label) return;

    btnLicense.classList.remove('activated', 'trial', 'unactivated');

    switch (this.currentStatus.status) {
      case 'activated':
        btnLicense.classList.add('activated');
        label.textContent = 'Bản quyền: Đã kích hoạt';
        break;
      case 'trial':
        btnLicense.classList.add('trial');
        label.textContent = 'Bản quyền: Dùng thử';
        break;
      default:
        btnLicense.classList.add('unactivated');
        label.textContent = 'Bản quyền: Chưa kích hoạt';
        break;
    }
  }

  private updateModalInfo(): void {
    const dispMachine = document.getElementById('disp-machine-id');
    const dispStatus = document.getElementById('disp-license-status');
    if (dispMachine) dispMachine.textContent = this.currentStatus.machine_id || 'Đang xác định...';
    if (dispStatus) {
      if (this.currentStatus.status === 'activated') {
        dispStatus.textContent = 'Đã kích hoạt';
        dispStatus.style.color = '#0ca678';
      } else if (this.currentStatus.status === 'trial') {
        dispStatus.textContent = 'Đang dùng thử (Trial)';
        dispStatus.style.color = '#f59f00';
      } else {
        dispStatus.textContent = 'Chưa kích hoạt';
        dispStatus.style.color = '#ff0000';
      }
    }
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    const msgBox = document.getElementById('license-message');
    if (!msgBox) return;
    msgBox.className = `msg-alert ${type}`;
    msgBox.textContent = msg;
    msgBox.classList.remove('hidden');
  }

  private bindEvents(): void {
    const btnOpen = document.getElementById('btn-license');
    const btnClose = document.getElementById('btn-close-license');
    const btnSubmit = document.getElementById('btn-submit-activate');
    const btnTrial = document.getElementById('btn-trial-continue');
    const inputKey = document.getElementById('input-license-key') as HTMLInputElement | null;

    btnOpen?.addEventListener('click', () => this.showModal());
    btnClose?.addEventListener('click', () => this.hideModal());

    btnTrial?.addEventListener('click', () => {
      if (this.currentStatus.status === 'unactivated') {
        this.currentStatus.status = 'trial';
        if (!isTauriEnvironment()) {
          localStorage.setItem('bkit_mock_trial', 'true');
        }
        this.updateUI();
      }
      this.hideModal();
    });

    btnSubmit?.addEventListener('click', async () => {
      if (!inputKey) return;
      const key = inputKey.value.trim();
      if (!key) {
        this.showMessage('Vui lòng nhập License Key.', 'error');
        return;
      }

      btnSubmit.setAttribute('disabled', 'true');
      btnSubmit.textContent = 'Đang kích hoạt...';

      try {
        const result = await invokeTauri<LicenseInfo>('activate_license', { key });
        this.currentStatus = result;
        this.updateUI();
        this.updateModalInfo();
        this.showMessage('Kích hoạt thành công! Cảm ơn bạn đã sử dụng BKIT Sheets.', 'success');
        setTimeout(() => {
          this.hideModal();
        }, 1500);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        this.showMessage(`Kích hoạt thất bại: ${errMsg}`, 'error');
      } finally {
        btnSubmit.removeAttribute('disabled');
        btnSubmit.textContent = 'Kích hoạt';
      }
    });
  }
}
