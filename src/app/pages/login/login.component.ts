import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TLUService } from '../../services/tlu.service';
import { CommonModule } from '@angular/common';
import { catchError, pipe, Subscription, throwError, timer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../components/toasts/toast.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy, OnInit{
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  redirectUri: string | null = null;
  state: string | null = null;

  /**
   *
   */
  constructor(private tluService: TLUService, 
    private toastService: ToastService,
    private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    console.log("LoginComponent initialized");
    this.route.queryParams.subscribe(params => {
      this.redirectUri = params['redirect_uri'] || null;
      this.state = params['state'] || null;
      console.log("param: ",  this.redirectUri, this.state);
      
      // // Kiểm tra nếu có sẵn token trong localStorage
      // const storedToken = localStorage.getItem('auth_token');
      
      // // Nếu đã đăng nhập và có redirect_uri, tự động chuyển hướng về VSCode
      // if (storedToken && this.redirectUri && storedUserId && storedUsername) {
      //   this.redirectToVSCode(storedToken, storedUserId, storedUsername);
      // }
    });
  }
  ngOnDestroy(): void {
    // this.clearErrorMessage();
  }

  private handleError(error: HttpErrorResponse){
    console.error('Có lỗi xảy ra');
    let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau.";
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      errorMessage = "Lỗi mạng. Vui lòng kiểm tra kết nối Internet.";
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
        errorMessage = "Lỗi từ máy chủ TLU. Vui lòng thử lại sau.";
    }
    this.toastService.showError(errorMessage);
;

    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  onSubmit() {
    this.isLoading = true;

    this.tluService.login(this.email, this.password).
      pipe(
        catchError(error => {
          this.isLoading = false;
          return this.handleError(error);
        })
      )
      .subscribe(
        (res) => {
          // console.log(res);
          // this.tluService.getUserInfo().pipe(
          //   catchError(error => {
          //     this.isLoading = false;
          //     return this.handleError(error);
          //   })
          // )
          // .subscribe(
          //   (userInfo) => {
          //     console.log(userInfo);
          //     localStorage.setItem('token', res.access_token);
          //     localStorage.setItem('userInfo', JSON.stringify(userInfo));
          //     this.isLoading = false;
          //     this.toastService.showSuccess("Đăng nhập thành công!");
          //   }
          // );
          localStorage.setItem('access_token', res.access_token);
          this.isLoading = false;
          this.toastService.showSuccess("Đăng nhập thành công!")
          
          this.redirectToVSCode(res.access_token)
        }
      )

  }


  // Phương thức chuyển hướng về VSCode với thông tin đăng nhập
  private redirectToVSCode(access_token: string): void {
    if (!this.redirectUri || !this.state) {
      console.error('Missing redirect URI or state');
      this.toastService.showError("Thiếu thông tin chuyển hướng. Vui lòng thử lại.");
      return;
    }
    
    try {
      // Tạo URL redirect với các tham số cần thiết
      const redirectUrl = new URL(this.redirectUri);
      redirectUrl.searchParams.append('access_token', access_token);
      redirectUrl.searchParams.append('state', this.state);
      
      window.location.href = redirectUrl.toString();
    } catch (error) {
      console.error('Error redirecting to VSCode:', error);
      this.toastService.showError("Lỗi chuyển hướng đến VSCode. Vui lòng thử lại sau.");
    }
  }
}
