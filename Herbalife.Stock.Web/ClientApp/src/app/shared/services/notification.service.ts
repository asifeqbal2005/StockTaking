import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable()
export class NotificationService {
  constructor(private toastr: ToastrService) {
  }

  printSuccessMessage(message: string) {
    this.toastr.success(message);
  }

  printErrorMessage(message: string) {
    this.toastr.error(message);
  }
  printWarningMessage(message: string) {
    this.toastr.warning(message);
  }

  printStickyWarningMessage(message: string) {
    this.toastr.warning(message, '', { timeOut: 0, extendedTimeOut: 0, closeButton: true, tapToDismiss: true, enableHtml: true, },);
  }
  printHtmlErrorMessage(message: string) {
    this.toastr.error(message, '', { timeOut: 10000, enableHtml: true });
  }

  printHtmlWarningMessage(message: string) {
    this.toastr.warning(message, '', { timeOut: 10000, enableHtml: true });
  }

  showToastMessage(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    Swal.fire({
      title: message,
      icon: type,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      toast: true,
      timerProgressBar: true,
      padding: '2em',
      showClass: {
        popup: ''  // Disable shaking animation
      }
    });
  }

  showNotificationMessage(message: string, type: 'success' | 'error' | 'warning' | 'info') {

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: type,
      title: message
    })    
  }

  ShowConfirmationMessageBox(title: string, message: string, icon?: any, confirmText?: string, cancelText?: string): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: message,
      showCloseButton: true,
      showCancelButton: true,
      icon: icon, // 'question', // warning, error, success, info, and question      
      confirmButtonText: confirmText, // 'Submit', // Need to dynamic      
      cancelButtonText: cancelText, //'Cancel', // Need to dynamic      
      //reverseButtons: true
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  ShowConfirmationDialog(message: string): Promise<boolean> {
    return Swal.fire({
      title: 'Are you sure?',
      text: message,
      showCloseButton: true,
      showCancelButton: true,
      icon: 'question', // Need to dynamic      
      confirmButtonText: 'Submit', // Need to dynamic      
      cancelButtonText: 'Cancel', // Need to dynamic      
      reverseButtons: true
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  ShowConfirmationDialogs(message: string): Promise<boolean> {
    return Swal.fire({
      title: 'Are you sure?',
      text: message,
      showCancelButton: true,
      showCloseButton: true,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      icon: 'success',
      confirmButtonText: 'Yes, download!',
      cancelButtonText: 'cancel download',
    }).then((result) => {
      return result.isConfirmed;
    });
  }

}
