import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private toastService: HotToastService,
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',Validators.required],
      remember: [false]
    });
  }
  // get f() { return this.loginForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.toastService.error('Invalid Form');
      return;
    }
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe(
      (res) => {
        if(res.statusCode == 200){
          localStorage.setItem('token', res.data);
          if(this.loginForm.value.remember){
            localStorage.setItem('email', this.loginForm.value.email);
            localStorage.setItem('password', this.loginForm.value.password);
          }
          this.toastService.success('Login Success');
          this.router.navigate(['/dashboard']);
        }
        console.log(res);
        if(res.statusCode == 400){
          this.toastService.error(res.error);
        }
      },
      (err) => {
        console.log(err);
        this.toastService.error(err.error.message);
      }
    )
  }
}
