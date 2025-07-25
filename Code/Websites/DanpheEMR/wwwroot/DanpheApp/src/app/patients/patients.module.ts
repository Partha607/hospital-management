import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ADT_DLService } from '../adt/shared/adt.dl.service';
import { AppointmentDLService } from '../appointments/shared/appointment.dl.service';
import { VisitDLService } from '../appointments/shared/visit.dl.service';
import { ClinicalDLService } from '../clinical/shared/clinical.dl.service';
import { LabsDLService } from '../labs/shared/labs.dl.service';
import { ImagingDLService } from '../radiology/shared/imaging.dl.service';
import { PatientsRoutingConstant } from "./patients-routing.constant";
import { PatientsBLService } from './shared/patients.bl.service';
import { PatientsDLService } from './shared/patients.dl.service';

import { PatientDeactivateGuard } from './shared/patient-deactivate-guard';

import { HamsPatientHealthCardComponent } from './health-card/hams-health-card/hams-health-card.component';
import { PatientHealthCardComponent } from './health-card/patient-health-card.component';
import { PatientNeighbourCardComponent } from './neighbour-card/patient-neighbour-card.component';
import { PatientHistoryComponent } from './patient-history/patient-hisotry.component';

////////for grid implementation
//import { AgGridModule } from 'ag-grid-angular/main';
//import { PatientGridComponent } from '../shared/danphe-grid/danphe-grid.component';
import { SharedModule } from "../shared/shared.module";

// import { PatientsDashboardComponent } from "../dashboards/patients/patientsdashboard.component";
import { QRCodeModule } from 'angular2-qrcode';


import { DanpheAutoCompleteModule } from '../shared/danphe-autocomplete/danphe-auto-complete.module';
import { PatientSharedModule } from './patient-shared.module';

import { PatientsMainComponent } from './patients-main.component';
import { PatientRegistrationMainComponent } from './registration/patient-registration-main.component';

//import { GuarantorComponent } from './registration/guarantor.component';
//import { InsuranceInfoComponent } from './registration/insurance-info.component';
//import { KinEmergencyContactComponent } from './registration/kin-emergency-contact.component';
//import { AddressComponent } from './registration/address.component';
//import { PatientComponent } from './registration/patient.component';
//import { PatientProfilePicComponent } from './registration/profile-pic.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientProfilePicComponent } from './profile-pic/profile-pic.component';
import { AddressComponent } from './registration/address/address.component';
import { PatientBasicInfoComponent } from './registration/basic-info/patient-basic-info.component';
import { GuarantorComponent } from './registration/guarantor/guarantor.component';
import { InsuranceInfoComponent } from './registration/insurance/insurance-info.component';
import { KinEmergencyContactComponent } from './registration/kin/kin-emergency-contact.component';
//import { MembershipSelectComponent } from '../settings-new/billing/memberships/select-membership-scheme/membership-select.component';
import { SettingsSharedModule } from '../settings-new/settings-shared.module';
//remove below import - "neighbourcard-backup"  after patient visitor card is implemented.
import { BillingSharedModule } from '../billing/billing-shared.module';
import { PatientsDashboardComponent } from '../dashboards/patients/patients-dashboard.component';
import { StickerSharedModule } from '../stickers/stickers-shared-module';
import { PatientNeighbourCard_Backup_Component } from './neighbour-card/patient-neighbour-card-backup.component';
import { MedicareRegistrationPatientModule } from './Pateint-Member-Registration/registration/medicare-registration-patient.module';

//import { MembershipSelectComponent } from './memberships/select-membership-scheme/membership-select.component';

@NgModule({
  providers: [PatientDeactivateGuard,
    PatientsDLService,
    PatientsBLService,
    AppointmentDLService,
    VisitDLService,
    ImagingDLService,
    ClinicalDLService,
    ADT_DLService,
    LabsDLService
  ],

  imports: [
    RouterModule.forChild(PatientsRoutingConstant),
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    //AgGridModule.forRoot(),
    HttpClientModule,
    SharedModule,
    QRCodeModule,
    ///  Ng2AutoCompleteModule,
    //WebcamModule,
    //ImageCropperModule
    DanpheAutoCompleteModule,
    PatientSharedModule,
    SettingsSharedModule,
    StickerSharedModule,
    BillingSharedModule,
    MedicareRegistrationPatientModule
  ],

  declarations: [
    PatientsMainComponent,
    PatientBasicInfoComponent,
    PatientRegistrationMainComponent,
    PatientListComponent,
    AddressComponent,
    GuarantorComponent,
    InsuranceInfoComponent,
    KinEmergencyContactComponent,
    PatientsDashboardComponent,
    PatientHistoryComponent,
    PatientHealthCardComponent,
    PatientNeighbourCardComponent,
    PatientProfilePicComponent,
    HamsPatientHealthCardComponent,
    PatientNeighbourCard_Backup_Component//remove this later after visitor card is implemented.
    //MembershipSelectComponent
    // , SelectEthnicGroupComponent
  ],

  bootstrap: []
})
export class PatientsModule { }
