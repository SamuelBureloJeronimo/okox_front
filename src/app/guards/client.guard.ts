import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { GeneralService } from '../services/general.service';
import { CookieService } from 'ngx-cookie-service';

export const ClientGuard: CanActivateFn = async () => {

  const auth = inject(GeneralService);
  const _router = inject(Router);
  const cookie = inject(CookieService);

  try {
    //Valida en el backend que el token sea válido
    let res = await lastValueFrom(auth.isAuth());
    /*
      Si es igual a cero el rol quiere decir que es un usuario normal,
      por lo que se le permite el acceso a su ruta.
    */
    if(res.sub === "0") return true;
    //Si no, entonces lo retorna al home
    else{
      _router.navigateByUrl("/");
      return false;
    }

    //Control de excepciones
  } catch (error: any) {
      Swal.fire(error.error.error, "Tu  sesión ha expirado, porfavor vuelve a iniciar sesión.", 'info').then(() =>{
        _router.navigate(['/']).then(() => {
          cookie.delete("token");
          // Esto asegura que la página se recargue solo después de la navegación
          window.location.reload();  // Recarga la página después de la navegación
        });
      });
      return false;
  }
};
