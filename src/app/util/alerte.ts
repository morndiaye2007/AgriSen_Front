import Swal from "sweetalert2";

export class Alertes {

    static confirmAction(titre:string,text:string, callbacks:any,callbacks2?:any){
        Swal.fire(
            {
                title:titre,
                icon:'question',
                text:text,
                showCancelButton:true,
                cancelButtonText:'non',
                confirmButtonText:'oui'
            }
        ).then((result:any)=>{
           if(result.isConfirmed){
            callbacks();
           }else{
               if(callbacks2){
                    callbacks2();
               }
           }
        })
    }

    static alerteResponse(titre:string,text:string,callbacks:any){
        Swal.fire(
            {
                title:titre,
                icon:'info',
                text:text,
                showCancelButton:false,
                confirmButtonText:"ok"
            }
        ).then((result:any)=>{
           if(result.isConfirmed){
            callbacks();
           }
        })
    }

    static alerteGlobal(successMessage?: string, errorMessage?: string){
        Swal.fire(
            {
                toast: true,
                position: 'top-end', 
                showConfirmButton: false, 
                timer: 3000, 
                timerProgressBar: true, 
                title: successMessage? successMessage: errorMessage,
                icon:  successMessage? 'success': 'error'
            }
        )
    }

    static alerteAddSuccess(message?:string){
        Swal.fire(
            {
                toast: true,
                position: 'top-end', 
                showConfirmButton: false, 
                timer: 3000, 
                timerProgressBar: true, 
                title: 'Enregistrement réussi: '+' '+ message, 
                icon: 'success'
            }
        ).then((result:any)=>{
           if(result.isConfirmed){
            // callbacks();
           }
        })
    }

    static alerteAddDanger(message?:string){
        Swal.fire(
            {
                toast: true,
                position: 'top-end', 
                showConfirmButton: false, 
                timer: 3000, 
                timerProgressBar: true, 
                title: 'Enregistrement échoué: '+' '+ message, 
                icon: 'error'
            }
        ).then((result:any)=>{
           if(result.isConfirmed){
            // callbacks();
           }
        })
    }

    static alerteDeleteSuccess(message?:string){
        Swal.fire(
            {
                toast: true,
                position: 'top-end', 
                showConfirmButton: false, 
                timer: 3000, 
                timerProgressBar: true, 
                title: 'Suppresion réussie :'+' '+message, 
                icon: 'success'
            }
        ).then((result:any)=>{
           if(result.isConfirmed){
            // callbacks();
           }
        })
    }

    static alerteDeleteDanger(message?:string){
        Swal.fire(
            {
                toast: true,
                position: 'top-end', 
                showConfirmButton: false, 
                timer: 3000, 
                timerProgressBar: true, 
                title: 'Suppresion échoué: '+' '+ message, 
                icon: 'error'
            }
        ).then((result:any)=>{
           if(result.isConfirmed){
            // callbacks();
           }
        })
    }

    static alerteUpdateSuccess(message?:string){
        Swal.fire(
            {
                toast: true,
                position: 'top-end', 
                showConfirmButton: false, 
                timer: 3000, 
                timerProgressBar: true, 
                title: 'Modification réussie: '+' '+ message, 
                icon: 'success'
            }
        ).then((result:any)=>{
           if(result.isConfirmed){
            // callbacks();
           }
        })
    }

    static alerteUpdateDanger(message?:string){
        Swal.fire(
            {
                toast: true,
                position: 'top-end', 
                showConfirmButton: false, 
                timer: 3000, 
                timerProgressBar: true, 
                title: 'Modification échouée: '+' '+ message, 
                icon: 'error'
            }
        ).then((result:any)=>{
           if(result.isConfirmed){
            // callbacks();
           }
        })
    }

    static draftAction(titre:string,text:string, callbacks:any,callbacks2?:any){
        Swal.fire(
            {
                title:titre,
                icon:'question',
                text:text,
                showCancelButton:true,
                cancelButtonText:'non',
                confirmButtonText:'Mettre en brouillon'
            }
        ).then((result:any)=>{
           if(result.isConfirmed){
            callbacks();
           }else{
               if(callbacks2){
                    callbacks2();
               }
           }
        })
    }

}