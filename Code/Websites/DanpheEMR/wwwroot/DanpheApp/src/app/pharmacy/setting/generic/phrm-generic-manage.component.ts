import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, Renderer2 } from "@angular/core";

import * as moment from 'moment/moment';
import { SecurityService } from '../../../security/shared/security.service';
import { DanpheHTTPResponse } from "../../../shared/common-models";
import { GridEmitModel } from "../../../shared/danphe-grid/grid-emit.model";
import { MessageboxService } from '../../../shared/messagebox/messagebox.service';
import { ENUM_DanpheHTTPResponses, ENUM_MessageBox_Status } from "../../../shared/shared-enums";
import { PharmacyBLService } from "../../shared/pharmacy.bl.service";
import { PHRMCategoryModel } from "../../shared/phrm-category.model";
import { PHRMGenericModel } from '../../shared/phrm-generic.model';
import PHRMGridColumns from '../../shared/phrm-grid-columns';

@Component({
    selector: "generic-type-add",
    templateUrl: "./phrm-generic-manage.html"
})

export class PHRMGenericManageComponent implements OnInit {
    public genericGridColumns: Array<any> = null;
    public genericList: Array<PHRMGenericModel> = new Array<PHRMGenericModel>();
    public selectedItem: PHRMGenericModel = new PHRMGenericModel();
    public showGenericAddPage: boolean = false;
    @Input("selectedGeneric")
    public selectedGeneric: PHRMGenericModel;
    @Output("callback-add")
    callbackAdd: EventEmitter<Object> = new EventEmitter<Object>();
    public update: boolean = false;
    public currentGeneric: PHRMGenericModel = new PHRMGenericModel();
    public index: number;
    public categoryList: Array<PHRMCategoryModel> = new Array<PHRMCategoryModel>();
    public selCategory: PHRMCategoryModel = new PHRMCategoryModel();
    public globalListenFunc: Function;
    public ESCAPE_KEYCODE = 27;   //to close the window on click of ESCape.

    @Input("showAddPage")
    public set value(val: boolean) {
        this.showGenericAddPage = val;
    }

    constructor(public pharmacyBLService: PharmacyBLService, public changeDetector: ChangeDetectorRef,
        public securityService: SecurityService, public msgBoxServ: MessageboxService, public renderer2: Renderer2) {
        this.genericGridColumns = PHRMGridColumns.GenericList;
        this.GetGenericList();
        this.getCategoryList();
    }

    ngOnInit() {
        this.globalListenFunc = this.renderer2.listen('document', 'keydown', e => {
            if (e.keyCode == this.ESCAPE_KEYCODE) {
                this.Close()
            }
        });
    }
    GetGenericList() {
        this.pharmacyBLService.GetGenericList()
            .subscribe((res: DanpheHTTPResponse) => {
                if (res.Status == ENUM_DanpheHTTPResponses.OK) {
                    this.genericList = res.Results;
                }
                else {
                    alert("Failed ! " + res.ErrorMessage);
                    console.log(res.ErrorMessage)
                }
            });
    }

    Add() {
        for (var i in this.currentGeneric.GenericValidator.controls) {
            this.currentGeneric.GenericValidator.controls[i].markAsDirty();
            this.currentGeneric.GenericValidator.controls[i].updateValueAndValidity();
        }


        if (this.genericList && this.genericList.length) {
            const isGenericNameAlreadyExists = this.genericList.some(s => s.GenericName.toLowerCase() === this.currentGeneric.GenericName.toLowerCase());
            if (isGenericNameAlreadyExists) {
                this.msgBoxServ.showMessage(ENUM_MessageBox_Status.Notice, [`Cannot add generic name as the Generic Name "${this.currentGeneric.GenericName}" already exists!`]);
                return;
            }
        }

        if (this.currentGeneric.IsValidCheck(undefined, undefined)) {
            this.currentGeneric.CreatedOn = moment().format('YYYY-MM-DD');
            this.pharmacyBLService.AddGenericName(this.currentGeneric)
                .subscribe((res: DanpheHTTPResponse) => {
                    if (res.Status == ENUM_DanpheHTTPResponses.OK) {
                        this.msgBoxServ.showMessage(ENUM_MessageBox_Status.Success, ["Generic Name"]);
                        this.CallBackAddToGrid(res);
                        this.currentGeneric = new PHRMGenericModel();
                    } else {
                        this.msgBoxServ.showMessage(ENUM_MessageBox_Status.Failed, ["Sorry!! Generic Name Cannot be save    " + res.ErrorMessage]);
                    }
                });
        }
    }

    Update() {
        for (var i in this.currentGeneric.GenericValidator.controls) {
            this.currentGeneric.GenericValidator.controls[i].markAsDirty();
            this.currentGeneric.GenericValidator.controls[i].updateValueAndValidity();
        }

        // if (this.genericList && this.genericList.length) {
        //     const isGenericNameAlreadyExists = this.genericList.some(s => s.GenericName === this.currentGeneric.GenericName && s.GenericId !== this.currentGeneric.GenericId);
        //     if (isGenericNameAlreadyExists) {
        //         this.msgBoxServ.showMessage(ENUM_MessageBox_Status.Notice, [`Cannot update generic name as the Generic Name "${this.currentGeneric.GenericName}" already exists!`]);
        //         return;
        //     }
        // }


        if (this.currentGeneric.IsValidCheck(undefined, undefined)) {
            this.currentGeneric.CreatedOn = moment().format('YYYY-MM-DD');
            this.pharmacyBLService.UpdateGenericName(this.currentGeneric)
                .subscribe((res: DanpheHTTPResponse) => {
                    if (res.Status == ENUM_DanpheHTTPResponses.OK) {
                        this.msgBoxServ.showMessage(ENUM_MessageBox_Status.Success, ["Generic Name is Updated"]);
                        this.CallBackAddToGrid(res);
                        this.currentGeneric = new PHRMGenericModel();
                    } else {
                        this.msgBoxServ.showMessage(ENUM_MessageBox_Status.Failed, ["Sorry!! Generic Name Cannot be Updated" + res.ErrorMessage]);
                    }
                });
        }
    }

    CallBackAddToGrid(res) {
        if (this.update && this.index != null) {
            this.genericList.splice(this.index, 1, res.Results);
            this.update = false;
        } else {
            this.genericList.push(res.Results);
        }
        this.genericList = this.genericList.slice();
        this.changeDetector.detectChanges();
        this.showGenericAddPage = false;
        this.index = null;
        this.AddUpdateResponseEmitter(res.Results);
    }

    public getCategoryList() {
        this.pharmacyBLService.GetCategoryList()
            .subscribe((res: DanpheHTTPResponse) => {
                if (res.Status == ENUM_DanpheHTTPResponses.OK) {
                    this.categoryList = res.Results;
                }
                else {
                    alert("Failed ! " + res.ErrorMessage);
                    console.log(res.ErrorMessage)
                }
            });
    }
    public AssignSelectedCategory() {
        try {
            if (this.selCategory.CategoryId) {
                if ((this.selCategory.CategoryId != 0) && (this.selCategory.CategoryId != null)) {
                    this.currentGeneric.CategoryId = this.selCategory.CategoryId;
                }
            }
        } catch (ex) {
            this.ShowCatchErrMessage(ex);
        }
    }
    public ShowCatchErrMessage(exception) {
        if (exception) {
            let ex: Error = exception;
            this.msgBoxServ.showMessage("error", ["Check error in Console log !"]);
            console.log("Error Messsage =>  " + ex.message);
            console.log("Stack Details =>   " + ex.stack);
        }
    }
    CategoryListFormatter(data: any): string {
        if (data.IsActive) {
            return data["CategoryName"];
        }
        else {
            return data["CategoryName"] + " |(<strong class='text-danger'>Deactivated)</strong>";
        }
    }
    ShowAddNewPage() {
        this.currentGeneric = new PHRMGenericModel();
        this.showGenericAddPage = true;
        this.update = false;
        this.setFocusById('genericname')
        //this.changeDetector.detectChanges();
    }

    GenericGridActions($event: GridEmitModel) {
        switch ($event.Action) {
            case "edit": {
                this.update = true;
                this.showGenericAddPage = true;
                this.currentGeneric = Object.assign(this.currentGeneric, $event.Data);
                this.index = this.genericList.findIndex(gn => gn.GenericId == $event.Data.GenericId);
                this.selCategory = this.categoryList.find(a => a.CategoryId == this.currentGeneric.CategoryId);
                break;
            }
        }
    }

    Close() {
        this.showGenericAddPage = false;
        this.update = false;
        this.selCategory = new PHRMCategoryModel();
        this.callbackAdd.emit();
    }

    CallBackAdd(generic: PHRMGenericModel) {
        this.genericList.push(generic);
        if (this.index != null)
            this.genericList.splice(this.index, 1);
        this.genericList = this.genericList.slice();
        this.changeDetector.detectChanges();
        this.showGenericAddPage = false;
        this.selectedItem = null;
        this.index = null;
    }
    CallBackAddUpdate(res) {
        if (res.Status == ENUM_DanpheHTTPResponses.OK) {
            var generic: any = {};
            generic.GenericId = res.Results.GenericId;
            generic.GenericName = res.Results.GenericName;
            generic.GeneralCategory = res.Results.GeneralCategory;
            generic.TherapeuticCategory = res.Results.TherapeuticCategory;
            generic.Counseling = res.Results.Counseling;
            generic.CategoryId = res.Results.CategoryId;
            generic.IsActive = res.Results.IsActive;
            this.AddUpdateResponseEmitter(generic);
            this.GetGenericList();;
            this.CallBackAdd(generic);
        }
        else {
            this.msgBoxServ.showMessage(ENUM_MessageBox_Status.Failed, ['some error ' + res.ErrorMessage]);
        }
    }

    AddUpdateResponseEmitter(generic) {
        this.callbackAdd.emit({ generic: generic });
    }
    setFocusById(IdToBeFocused) {
        window.setTimeout(function () {
            document.getElementById(IdToBeFocused).focus();
        }, 20);
    }
}
