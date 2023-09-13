import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/service/auth/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private toastService: HotToastService,
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['',Validators.required],
      remember: [false]
    });
  }
  onSubmit() {
    if (this.registerForm.invalid) {
      this.toastService.error('Invalid Form');
      return;
    }
    console.log(this.registerForm.value);
    this.authService.register(this.registerForm.value).subscribe(
      (res) => {
        if(res.statusCode == 201){
          this.toastService.success('Register Success');
        }
        if(res.statusCode == 400){
          this.toastService.error('Email already exists');
        }
      },
      (err) => {
        console.log(err);
        this.toastService.error(err.error.message);
      }
    )
  }
}
