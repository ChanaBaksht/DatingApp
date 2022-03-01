import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { MemberEditComponent } from "../member-edit/member-edit.component";

@Injectable({
    providedIn: 'root'
})
export class preventUnsavedChangesGuard implements CanDeactivate<MemberEditComponent>{

    canDeactivate(component: MemberEditComponent): boolean {
        if (component.editForm.dirty) {
            return confirm("R U Sure U want to continue? any unsaved changes will be lost... dude!");
        }
        return true;
    }

}