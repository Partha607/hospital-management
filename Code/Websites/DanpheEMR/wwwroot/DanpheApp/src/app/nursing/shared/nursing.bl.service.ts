import { Injectable } from "@angular/core";

import { BillingTransactionItem } from "../../billing/shared/billing-transaction-item.model";
import { LabTestRequisition } from "../../labs/shared/lab-requisition.model";
import { ImagingItemRequisition } from "../../radiology/shared/imaging-item-requisition.model";

import { HttpClient } from "@angular/common/http";
import * as _ from "lodash";
import "rxjs";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/map";
import { ADT_DLService } from "../../adt/shared/adt.dl.service";
import { VisitDLService } from "../../appointments/shared/visit.dl.service";
import { BillItemRequisition } from "../../billing/shared/bill-item-requisition.model";
import { BillingDLService } from "../../billing/shared/billing.dl.service";
import { CoreService } from "../../core/shared/core.service";
import { LabsDLService } from "../../labs/shared/labs.dl.service";
import { ImagingDLService } from "../../radiology/shared/imaging.dl.service";
import { SecurityService } from "../../security/shared/security.service";
import { NursingDLService } from "./nursing.dl.service";

import * as moment from "moment";
import { Observable, Subject } from "rxjs";
import { NotesModel } from "../../clinical-notes/shared/notes.model";
import { ClinicalDLService } from "../../clinical/shared/clinical.dl.service";
import { DanpheHTTPResponse } from "../../shared/common-models";
import { ENUM_DateTimeFormat } from "../../shared/shared-enums";
import { DrugsRequisitonModel } from "../shared/drugs-requsition.model";
import { ConsultationRequestModel } from "./consultation-request.model";
import { DietType } from "./diet-type.model";
@Injectable()
export class NursingBLService {

  public diagnosisSubject: Subject<any> = new Subject<any>(); //! 12thMay'23, Used any here because it used any from its source as well.
  constructor(
    public nursingDLService: NursingDLService,
    public imagingDLService: ImagingDLService,
    public billingDLService: BillingDLService,
    public labsDLService: LabsDLService,
    public securityService: SecurityService,
    public visitDLService: VisitDLService,
    public admissionDLService: ADT_DLService,
    public http: HttpClient,
    public coreService: CoreService,
    public clinicalDLService: ClinicalDLService,
  ) { }

  //Get Nursing Order details by Patient ID
  public GetNursingOrderListByPatientId(patientId) {
    return this.nursingDLService
      .GetNursingOrderListByPatientId(patientId)
      .map((responseData) => {
        return responseData;
      });
  }
  //public Method: Post all (Lab, Imaging and all other department items) Nursing Order Items to Billing Requisition
  public PostBillingRequisitionItems(
    billTranItems: Array<BillingTransactionItem>
  ) {
    let billReqItems = this.GetMap_ReqItemsFromTxnItems(billTranItems);
    return this.nursingDLService
      .PostBillingReqItems(billReqItems)
      .map((responseData) => {
        return responseData;
      });
  }
  //public Method: Map all Nursing Items (originally we use billingTransactionItem model ) for Billing Transaction Requisition
  public GetMap_ReqItemsFromTxnItems(
    billItems: Array<BillingTransactionItem>
  ): Array<BillItemRequisition> {
    let billReqItemsTemp: Array<BillItemRequisition> = billItems.map(function (
      item
    ) {
      let bilReqItm = new BillItemRequisition();
      bilReqItm.ItemId = item.ItemId;
      bilReqItm.RequisitionId = item.RequisitionId;
      bilReqItm.ItemName = item.ItemName;
      bilReqItm.ProcedureCode = item.ProcedureCode;
      bilReqItm.ServiceDepartmentId = item.ServiceDepartmentId;
      bilReqItm.PatientId = item.PatientId;
      bilReqItm.PatientVisitId = item.PatientVisitId;
      bilReqItm.ServiceDepartment = item.ServiceDepartmentName;
      bilReqItm.DepartmentName = item.ServiceDepartmentName;
      bilReqItm.Quantity = item.Quantity;
      bilReqItm.PerformerId = item.PrescriberId;
      bilReqItm.AssignedTo = item.PerformerId;
      bilReqItm.CreatedBy = item.CreatedBy;
      bilReqItm.CreatedOn = item.CreatedOn;
      bilReqItm.Price = item.Price;
      return bilReqItm;
    });
    return billReqItemsTemp;
  }

  public GetOPDList(fromDate, toDate) {
    //fromDate,toDate
    //var fromDate = moment().subtract(2, 'days').format('YYYY-MM-DD');
    //var toDate = moment().add(1, 'days').format('YYYY-MM-DD');
    return this.nursingDLService
      .GetOpdVisits(fromDate, toDate)
      .map((responseData) => {
        return responseData;
      });
  }

  public GetOPDPastDataList(fromDate, toDate) {
    return this.nursingDLService
      .GetPastDataVisits(fromDate, toDate)
      .map((responseData) => {
        return responseData;
      });
  }

  // public GetOPDListByDate(fromDate: string, toDate: string) {
  //     var finalDate = toDate;
  //     finalDate = moment(toDate).add(1, 'days').format('YYYY-MM-DD');
  //     return this.visitDLService.GetPastVisits(fromDate, finalDate)
  //         .map((responseData) => {
  //             return responseData;
  //         });
  // }

  public GetAdmittedList(fromDate, toDate, searchTxt, wardId) {
    return this.admissionDLService
      .GetAdmittedList(fromDate, toDate, searchTxt, wardId)
      .map((responseData) => {
        return responseData;
      });
  }

  public GetPendingReceiveTransferredList() {
    return this.admissionDLService
      .GetPendingReceiveTransferredList()
      .map((responseData) => {
        return responseData;
      });
  }

  public GetADTDataByVisitId(patVisitId) {
    let admissionStatus = "admitted";
    return this.admissionDLService
      .GetADTDataByVisitId(admissionStatus, patVisitId)
      .map((responseData) => {
        return responseData;
      });
  }

  //This method Post all dept related Nursing Order Items
  //and after post it take response and add requisitionId to respective billRequisitionItems
  //It return single billRequisitionItem object with or without requisitionId
  // public PostNursingOrderToDept(
  //   billingTransactionItems: Array<BillingTransactionItem>
  // ): Observable<any> {
  //   let labItems: Array<BillingTransactionItem> = new Array<
  //     BillingTransactionItem
  //   >(); //local variable for lab department items
  //   let imgingItems: Array<BillingTransactionItem> = new Array<
  //     BillingTransactionItem
  //   >(); //local variable for Imaging/Radiology department

  //   //updating info for Lab and Radiology list on service departmetn name
  //   //Because we post separately Lab and Radiology to DB
  //   for (var s = 0; s < billingTransactionItems.length; s++) {
  //     let integrationName = this.coreService.GetServiceIntegrationName(
  //       billingTransactionItems[s].ServiceDepartmentName
  //     );
  //     if ((integrationName = "Radiology")) {
  //       imgingItems.push(billingTransactionItems[s]);
  //     } else if ((integrationName = "LAB")) {
  //       labItems.push(billingTransactionItems[s]); //Push only Lab items
  //     }
  //   }
  //   let labItms = this.GetLabItemsMapped(labItems); //after mapping lab items
  //   let imgItems = this.GetImagingItemsMapped(imgingItems); //after mapping imaging items
  //   let deptHttpRequests = [];
  //   let dptRequestIndexes = [];
  //   let currIndex = 0;
  //   if (labItms && labItms.length > 0) {
  //     deptHttpRequests.push(
  //       this.nursingDLService.PostLabItemsRequisition(labItms).map((res) => res)
  //     );
  //     dptRequestIndexes.push({ dptName: "lab", index: currIndex });
  //     currIndex++;
  //   }
  //   if (imgItems && imgItems.length > 0) {
  //     deptHttpRequests.push(
  //       this.nursingDLService
  //         .PostImagingItemsRequest(imgItems)
  //         .map((res) => res)
  //     );
  //     dptRequestIndexes.push({ dptName: "radiology", index: currIndex });
  //     currIndex++;
  //   }
  //   //ForkJoin functionality it wait for all response from all dept and then do functionality and return one single object
  //   return Observable.forkJoin(deptHttpRequests).map((data: any[]) => {
  //     let labResponse: any =
  //       dptRequestIndexes.filter((a) => a.dptName == "lab").length > 0 &&
  //         ((a) => a.Status == "OK")
  //         ? data[dptRequestIndexes.find((a) => a.dptName == "lab").index]
  //         : null;
  //     let imgResponse: any =
  //       dptRequestIndexes.filter((a) => a.dptName == "radiology").length > 0 &&
  //         ((a) => a.Status == "OK")
  //         ? data[dptRequestIndexes.find((a) => a.dptName == "radiology").index]
  //         : null;

  //     ///assign the RequisitionIds of each department back to the BillingTransactionItem's list
  //     billingTransactionItems.forEach((billItem) => {
  //       if (labResponse && labResponse.Results.length > 0) {
  //         let labResponseResults = labResponse.Results;
  //         let labItm = labResponseResults.find(
  //           (i) => i.LabTestId == billItem.ItemId
  //         );
  //         if (labItm) {
  //           billItem.RequisitionId = labItm.RequisitionId;
  //         }
  //       }
  //       if (imgResponse && imgResponse.Results.length > 0) {
  //         let imgResponseResults = imgResponse.Results;
  //         let imgItm = imgResponseResults.find(
  //           (i) => i.imagingItemId == billItem.ItemId
  //         );
  //         if (imgItm) {
  //           billItem.RequisitionId = imgItm.ImagingRequisitionId;
  //         }
  //       }
  //     });
  //     return {
  //       Status: billingTransactionItems.length > 0 ? "OK" : "Failed",
  //       Results: billingTransactionItems,
  //     };
  //   });
  // }
  // Post Drugs request from nursing to pharmacy.
  public PostDrugsRequisition(drugReq: DrugsRequisitonModel) {
    try {
      let newDeugReq: any = _.omit(drugReq, [
        "selectedPatient.PHRMPatientValidator",
      ]);
      let newDrugReqItems = drugReq.RequisitionItems.map((item) => {
        return _.omit(item, [
          "positiveNumberValdiator",
          "DrugsRequestValidator",
          "positiveNumberValdiatortest",
          "DrugsRequestValidatortest",
          "GRItems",
          "Items",
        ]);
      });
      newDeugReq.RequisitionItems = newDrugReqItems;
      let data = JSON.stringify(newDeugReq);
      return this.nursingDLService.PostDrugsRequisition(data).map((res) => {
        return res;
      });
    } catch (ex) {
      throw ex;
    }
  }

  //public Method: Map all transactionItems (Nursing Requisition) for post against Lag Department
  public GetLabItemsMapped(billItems: Array<BillingTransactionItem>): string {
    let currentUser: number = this.securityService.GetLoggedInUser().EmployeeId; //logged in doctor
    let labItems: Array<LabTestRequisition> = new Array<LabTestRequisition>();
    billItems.forEach((bill) => {
      labItems.push({
        RequisitionId: 0,
        PatientId: bill.PatientId,
        PatientVisitId: bill.PatientVisitId,
        PrescriberId: bill.PrescriberId,
        LabTestId: bill.ItemId,
        ProcedureCode: bill.ProcedureCode,
        LOINC: null,
        LabTestName: bill.ItemName,
        LabTestSpecimen: null,
        LabTestSpecimenSource: null,
        PatientName: null,
        Diagnosis: null,
        Urgency: null,
        OrderDateTime: null,
        PrescriberName: null,
        BillingStatus: "unpaid",
        OrderStatus: "active",
        SampleCode: null,
        RequisitionRemarks: null,
        CreatedBy: null,
        CreatedOn: null,
        SampleCreatedBy: null,
        SampleCreatedOn: null,
        Comments: null,
        DiagnosisId: null,
        ReportTemplateId: 0,
        VisitType: bill.BillingType,
        RunNumberType: "",
        LabReportId: null,
        WardName: null,
        IsActive: true,
        IsVerified: null,
        VerifiedBy: null,
        VerifiedOn: null,
        ResultingVendorId: 0,
        HasInsurance: false,
        SampleCollectedOnDateTime: null,
        BillCancelledBy: null,
        BillCancelledOn: null,
        LabTypeName: bill.LabTypeName,
        IsSmsSend: null,
        IsSelected: false,
        ServiceItemId: bill.ServiceItemId,
        SampleReceivedOn: null,
        IsPreVerified: false,
        PreVerifiedBy: null,
        PreVerifiedOn: null,
        CreatedDay: moment().format(ENUM_DateTimeFormat.Year_Month_Day)
      });
    });
    let labTestReqtemp = labItems.map(function (item) {
      //item. = Patient.GetClone(item.Patient);
      var temp = _.omit(item, ["ItemList"]);
      return temp;
    });
    let data = JSON.stringify(labItems);
    return data;
  }
  //public Method: Map all transactionItems (Nursing Requisition) for post against Imaging/Radiology department
  public GetImagingItemsMapped(
    billItems: Array<BillingTransactionItem>
  ): Array<ImagingItemRequisition> {
    let currentUser: number = this.securityService.GetLoggedInUser().EmployeeId; //logged in doctor
    let imgItems: Array<ImagingItemRequisition> = new Array<
      ImagingItemRequisition
    >();
    billItems.forEach((bill) => {
      imgItems.push({
        ImagingItemId: bill.ItemId,
        PatientVisitId: bill.PatientVisitId,
        PatientId: bill.PatientId,
        PrescriberName: bill.PrescriberName,
        ImagingTypeName: bill.ServiceDepartmentName,
        ImagingTypeId: bill.ServiceDepartmentId,
        RequisitionRemarks: null,
        ImagingDate: bill.PaidDate,
        OrderStatus: "active",
        PrescriberId: bill.PrescriberId,
        ImagingRequisitionId: 0,
        ImagingItemName: bill.ItemName,
        ProcedureCode: bill.ProcedureCode,
        BillingStatus: "unpaid",
        Urgency: null,
        DiagnosisId: null,
        HasInsurance: false, //sud: 21Jul'19--Default value (for Govt Insurance)
        WardName: null,
        ServiceItemId: bill.ServiceItemId,
      });
    });
    return imgItems;
  }

  public CancelRadRequest(item: BillingTransactionItem) {
    var temp = _.omit(item, [
      "ItemList",
      "BillingTransactionItemValidator",
      "Patient",
    ]);
    let data = JSON.stringify(temp);
    return this.nursingDLService.CancelRadRequest(data).map((responseData) => {
      return responseData;
    });
  }

  //cancel nursing requested items
  public CancelItemRequest(item: BillingTransactionItem) {
    var temp = _.omit(item, [
      "ItemList",
      "BillingTransactionItemValidator",
      "Patient",
    ]);
    let data = JSON.stringify(temp);
    return this.nursingDLService.CancelItemRequest(data).map((responseData) => {
      return responseData;
    });
  }

  public CancelBillRequest(item: BillingTransactionItem) {
    var temp = _.omit(item, [
      "ItemList",
      "BillingTransactionItemValidator",
      "Patient",
    ]);
    let data = JSON.stringify(temp);
    return this.nursingDLService.CancelBillRequest(data).map((responseData) => {
      return responseData;
    });
  }

  public GetNephrologyPatients() {
    return this.nursingDLService.GetNephrologyPatients().map((responseData) => {
      return responseData;
    });
  }
  //submit a new hemodialysis report
  public SubmitHemoReport(newHemoReport) {
    return this.nursingDLService
      .SubmitHemoReport(newHemoReport)
      .map((responseData) => {
        return responseData;
      });
  }
  //check for last hemodialysis report
  public CheckForLastReport(patientId) {
    return this.nursingDLService
      .CheckForLastReport(patientId)
      .map((responseData) => {
        return responseData;
      });
  }
  //check for previous reports
  public PreviousReportList(patientId) {
    return this.nursingDLService
      .PreviousReportList(patientId)
      .map((responseData) => {
        return responseData;
      });
  }

  public PostPatientReceivedStatus(NoteMaster: NotesModel) {
    var temp = _.omit(NoteMaster, [
      "DischargeSummaryNote",
      "SubjectiveNote",
      "ObjectiveNote",
      "ProcedureNote",
      "ClinicalDiagnosis",
      "AllIcdAndOrders",
      "EmergencyNote",
      "ProgressiveNote",
    ]);
    var data = JSON.stringify(temp);
    return this.nursingDLService
      .PostPatientReceivedStatus(data)
      .map((responseData) => {
        return responseData;
      });
  }
  ///Get Notes Template
  public GetNoteTypeList() {
    return this.clinicalDLService.GetNoteTypeList().map(res => res);
  }

  public UndoPatientTransfer(patVisitId, remarks: string) {
    return this.nursingDLService.UndoPatientTransfer(patVisitId, remarks).map((responseData) => {
      return responseData;
    });
  }


  //post favourite patients
  public AddToFavorites(patVisitId, preferenceType, wardId) {
    return this.nursingDLService.AddFavouritePatient(patVisitId, preferenceType, wardId).map((responseData) => {
      return responseData;
    });
  }

  //post to clinicalpatient info table
  public AddComplaints(chiefComplains) {
    return this.nursingDLService.AddToClinicalInfo(chiefComplains).map((responseData) => {
      return responseData;
    })
  }

  public UpdateClinicalInfo(patientId, patientVisitId, complains) {
    return this.nursingDLService.UpdateClinicalInfo(patientId, patientVisitId, complains).map((responseData) => {
      return responseData;
    })
  }

  public GetComplaints(patVisitId) {
    return this.nursingDLService.GetComplaints(patVisitId).map((responseData) => {
      return responseData;
    })
  }
  public GetAllDepartmentsList() {
    return this.nursingDLService.GetAllDepartments().map((responseData) => {
      return responseData;
    })
  }
  GetBillingSummaryForPatient(patientId: number, patientVisitId: number) {
    return this.nursingDLService.GetBillingSummaryForPatient(patientId, patientVisitId).map((responseData) => {
      return responseData;
    })
  }
  public PostNursingCheckinDetails(checkInDetails) {
    return this.nursingDLService.PostNursingCheckinDetails(checkInDetails).map((responseData) => {
      return responseData;
    })
  }

  public AddDiagnosisSelectedList(SelectedICD10List: any) {
    this.diagnosisSubject.next(SelectedICD10List);
  }
  public SelectedDiagnosisList() {
    return this.diagnosisSubject.asObservable();
  } public PostfreeReferalDetails(referDoctorDepartment) {
    return this.nursingDLService.PostfreeReferalDetails(referDoctorDepartment).map((responseData) => {
      return responseData;
    })
  }
  public PostNursingCheckOutDetails(nursingOpdCheckout) {
    return this.nursingDLService.PostNursingCheckOutDetails(nursingOpdCheckout).map((responseData) => {
      return responseData;
    })
  }

  public UpdateExchangedDoctorDepartmentDetails(exchangedDoctorDepartment) {
    return this.nursingDLService.UpdateExchangedDoctorDepartmentDetails(exchangedDoctorDepartment).map((responseData) => {
      return responseData;
    })
  }
  public GetAllDietTypes() {
    return this.nursingDLService.GetAllDietTypes().map((responseData) => {
      return responseData;
    })
  }
  public GetAllInpatientListWithDietDetail(wardId: number) {
    return this.nursingDLService.GetAllInpatientListWithDietDetail(wardId).map((responseData) => {
      return responseData;
    })
  }

  public GetPatientDietHistory(PatientVisitId: number) {
    return this.nursingDLService.GetPatientDietHistory(PatientVisitId).map((responseData) => {
      return responseData;
    })
  }
  public AddPatientDietType(diet: DietType) {
    return this.nursingDLService.AddPatientDietType(diet).map((responseData) => {
      return responseData;
    })
  }

  public GetConsultationRequestsByPatientVisitId(PatientVisitId: number): Observable<DanpheHTTPResponse> {
    return this.nursingDLService.GetConsultationRequestsByPatientVisitId(PatientVisitId).map((responseData) => {
      return responseData;
    });
  }

  public GetPatientDetailsByPatientVisitIdForConsultationRequest(PatientVisitId: number): Observable<DanpheHTTPResponse> {
    return this.nursingDLService.GetPatientDetailsByPatientVisitIdForConsultationRequest(PatientVisitId).map((responseData) => {
      return responseData;
    });
  }

  public GetAllApptDepartment(): Observable<DanpheHTTPResponse> {
    return this.nursingDLService.GetAllApptDepartment().map((responseData) => {
      return responseData;
    });
  }

  public GetAllAppointmentApplicableDoctor(): Observable<DanpheHTTPResponse> {
    return this.nursingDLService.GetAllAppointmentApplicableDoctor().map((responseData) => {
      return responseData;
    });
  }

  public AddNewConsultationRequest(newConsultationRequest: ConsultationRequestModel): Observable<DanpheHTTPResponse> {
    return this.nursingDLService.AddNewConsultationRequest(newConsultationRequest).map((responseData) => {
      return responseData;
    })
  }

  public ResponseConsultationRequest(responseConsultationRequest: ConsultationRequestModel): Observable<DanpheHTTPResponse> {
    return this.nursingDLService.ResponseConsultationRequest(responseConsultationRequest).map((responseData) => {
      return responseData;
    })
  }
  public GetInvestigationResults(FromDate, ToDate, patientId, patientVisitId) {
    return this.nursingDLService
      .GetInvestigationResults(FromDate, ToDate, patientId, patientVisitId)
      .map((responseData) => {
        return responseData;
      });
  }
}
