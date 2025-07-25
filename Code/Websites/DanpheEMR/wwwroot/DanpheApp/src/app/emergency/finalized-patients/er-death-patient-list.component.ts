import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { VisitService } from '../../appointments/shared/visit.service';
import { CoreService } from '../../core/shared/core.service';
import { PatientService } from '../../patients/shared/patient.service';
import { GridEmitModel } from '../../shared/danphe-grid/grid-emit.model';
import { MessageboxService } from '../../shared/messagebox/messagebox.service';
import EmergencyGridColumnSettings from '../shared/emergency-gridcol-settings';
import { EmergencyPatientModel } from '../shared/emergency-patient.model';
import { EmergencyBLService } from '../shared/emergency.bl.service';
import { SelectedPatForDischargeModel } from '../shared/selectedDischarge.model';


@Component({
  templateUrl: './er-death-patients.html'
})

// App Component class
export class ERDeathPatientListComponent {
  public showOrderPopUp: boolean = false;
  public showERPatRegistration: boolean = false;
  public showSummaryView: boolean = false;
  public showSummaryAdd: boolean = false;
  public showAddVitals: boolean = false;

  public showVitalsList: boolean = true;

  public visitId: number = null;
  public patientId: number = null;
  public showGridList: boolean = true;

  public loading: boolean = false;

  public selectedEmergencyPatient: EmergencyPatientModel = new EmergencyPatientModel();
  public selectedERPatientToEdit: EmergencyPatientModel = new EmergencyPatientModel();
  public selectedDischarge: SelectedPatForDischargeModel = new SelectedPatForDischargeModel();

  public allDeathPatients: Array<EmergencyPatientModel> = new Array<EmergencyPatientModel>();

  public ERDeathPatientGridCol: Array<any> = null;
  public globalVisit: any;
  public globalPatient: any;
  public caseIdList: Array<number> = new Array<number>();
  public casesList = [];
  public filteredData: any;


  constructor(public changeDetector: ChangeDetectorRef, public msgBoxServ: MessageboxService, public patientService: PatientService, public visitService: VisitService,
    public emergencyBLService: EmergencyBLService, public coreService: CoreService, public router: Router) {
    this.ERDeathPatientGridCol = EmergencyGridColumnSettings.ERDeathPatientList;
    //this.GetERDeathPatientList();
  }



  public GetERDeathPatientList() {
    var id = this.caseIdList ? this.caseIdList : null;
    this.emergencyBLService.GetAllDeathERPatients(id[0])
      .subscribe(res => {
        if (res.Status == "OK") {
          this.allDeathPatients = res.Results;
          this.filteredData = res.Results;
          if (this.caseIdList[0] == 6) {
            this.filterNestedDetails();
          }
        }
        else {
          this.msgBoxServ.showMessage("Failed", ["Cannot Get Emergency Dead PatientList !!"]);
        }
      });
  }

  public ParentOfPopUpClicked($event) {
    var currentTarget = $event.currentTarget;
    var target = $event.target;
    if (target == currentTarget) {
      this.CloseAllERPatientPopUp();
    }
  }
  public CloseAllERPatientPopUp() {
    var body = document.getElementsByTagName("body")[0];
    body.style.overflow = "inherit";
    this.changeDetector.detectChanges();
    //Resets Order PopUp
    this.selectedEmergencyPatient = new EmergencyPatientModel();
    this.selectedERPatientToEdit = new EmergencyPatientModel();
    this.showOrderPopUp = false;
    this.showERPatRegistration = false;
    this.showSummaryView = false;
    this.showSummaryAdd = false;
    this.showAddVitals = false;
  }

  //Called each time just before any PopUp Opens
  public ResetAllAndHideParentBodyScroll() {
    this.showERPatRegistration = false;
    this.showOrderPopUp = false;
    this.showSummaryView = false;
    this.showSummaryAdd = false;
    var body = document.getElementsByTagName("body")[0];
    body.style.overflow = "hidden";
  }


  EditAction(event: GridEmitModel) {
    switch (event.Action) {
      case "edit": {
        this.selectedERPatientToEdit = new EmergencyPatientModel();
        this.showERPatRegistration = false;
        this.changeDetector.detectChanges();
        this.selectedERPatientToEdit = Object.assign(this.selectedERPatientToEdit, event.Data);
        this.showERPatRegistration = true;
      }
        break;
      case "order": {
        this.ResetAllAndHideParentBodyScroll();
        this.selectedEmergencyPatient = new EmergencyPatientModel();
        this.changeDetector.detectChanges();
        this.selectedEmergencyPatient = Object.assign(this.selectedEmergencyPatient, event.Data);
        this.showOrderPopUp = true;
      }
        break;
      case "add-vitals": {
        this.ResetAllAndHideParentBodyScroll();
        this.selectedEmergencyPatient = new EmergencyPatientModel();
        this.changeDetector.detectChanges();
        this.selectedEmergencyPatient = Object.assign(this.selectedEmergencyPatient, event.Data);
        this.visitId = this.selectedEmergencyPatient.PatientVisitId;
        this.showAddVitals = true;
      }
        break;
      case "dischargesummary": {
        this.CloseAllERPatientPopUp();
        this.visitId = event.Data.PatientVisitId;
        this.patientId = event.Data.PatientId;
        this.showGridList = false;

      }
        break;
      case "patientoverview": {
        this.SetPatDataToGlobal(event.Data);
        this.router.navigate(["/Emergency/PatientOverviewMain"]);
      }
        break;
      default:
        break;
    }
  }

  Back() {
    this.ResetAllAndHideParentBodyScroll();
    this.CloseAllERPatientPopUp();
    this.changeDetector.detectChanges();
    this.GetERDeathPatientList();
    this.showGridList = true;
  }

  CloseSummaryAdd() {
    this.CloseAllERPatientPopUp();
    this.selectedDischarge = new SelectedPatForDischargeModel();
  }

  public ReturnFromOrderAction($event) {
    this.CloseAllERPatientPopUp();
  }

  public ReturnFromPatRegistrationEdit($event) {
    this.CloseAllERPatientPopUp();
    if ($event.submit) {
      // let itmIndex = this.allDeathPatients.findIndex(tst => tst.ERPatientId == $event.ERPatient.ERPatientId);
      // if (itmIndex >= 0) {
      //   this.allDeathPatients.splice(itmIndex, 1, $event.ERPatient);
      //   this.allDeathPatients = this.allDeathPatients.slice();
      // } else {
      this.GetERDeathPatientList();
      // }
    }
  }


  public SetPatDataToGlobal(data): void {
    this.globalPatient = this.patientService.CreateNewGlobal();
    this.globalPatient.PatientId = data.PatientId;
    this.globalPatient.PatientCode = data.PatientCode;
    this.globalPatient.ShortName = data.Name;
    this.globalPatient.DateOfBirth = data.DateOfBirth;
    this.globalPatient.Gender = data.Gender;
    this.globalPatient.Age = data.Age;
    this.globalPatient.Address = data.Address;
    this.globalPatient.PhoneNumber = data.ContactNo;


    this.globalVisit = this.visitService.CreateNewGlobal();
    this.globalVisit.ERTabName = "finalized-death";
    this.globalVisit.PatientVisitId = data.PatientVisitId;
    this.globalVisit.PatientId = data.PatientId;
    this.globalVisit.ProviderId = data.ProviderId;
    this.globalVisit.VisitType = "emergency";
    this.globalVisit.ProviderName = data.ProviderName;
    this.globalVisit.VisitDate = moment(data.VisitDateTime).format("YYYY-MM-DD");
    this.globalVisit.VisitTime = moment(data.VisitDateTime).format("HH:MM");
  }

  PatientCasesOnChange($event) {
    if ($event.mainDetails && $event.mainDetails != 0) {
      this.caseIdList = [];
      this.casesList = [];
      this.caseIdList.push($event.mainDetails);
      if ($event.nestedDetails && $event.nestedDetails.length >= 1) {
        $event.nestedDetails.forEach(v => {
          this.caseIdList.push(v.Id);
          this.casesList.push(v);
        });
      }
    }
    else {
      this.caseIdList = [];
      this.caseIdList.push($event.mainDetails)
    }
    this.GetERDeathPatientList();
  }

  filterNestedDetails() {
    this.caseIdList.slice(1);
    this.filteredData = this.allDeathPatients.filter(a => this.caseIdList.includes(a.PatientCases.SubCase));
  }
}
