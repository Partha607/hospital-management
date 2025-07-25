import { Patient } from '../../patients/shared/patient.model';
import { FooterTextsList_Dto } from './DTOs/footer-text-list.dto';

export class ImagingItemReport {
  public ImagingReportId: number = 0;
  public ImagingRequisitionId: number = 0;
  public PatientVisitId: number = 0;
  public PatientId: number = 0;
  public PrescriberName: string = null; // Dev :15June'22 Changed ProviderName to PrescriberName
  public PrescriberId: number = null; // Dev :15June'22 Changed ProviderId to PrescriberId
  public PerformerId: number = null; // Dev :21June'22  Added new column PerformerId
  public PerformerName: string = ''; // Dev :21June'22  Added new column PerformerName
  public ImagingItemId: number = 0;
  public ImagingItemName: string = null;
  public ImagingTypeId: number = 0;
  public ImagingTypeName: string = null;
  public ImageFullPath: string = "";
  public ImageName: string = "";
  public CreatedOn: string = null;
  public Signatories: string;
  public OrderStatus: string = "";
  public ReportingDoctorId: number = null;
  public ReportTemplateId: number = null;
  public ReportText: string = "";
  public TemplateName: string = "Not Set";//default value for template.
  public CreatedBy: number = null;
  public ModifiedBy: number = null;
  public ModifiedOn: number = null;
  public PatientStudyId: string = "";
  public Patient: Patient = new Patient();

  //only for client side use
  public IsShowButton: boolean = false;
  public ReportingDoctorName: string = null;

  public Indication: string = null;

  public ReportingDoctorNamesFromSignatories: string = null;
  public HasInsurance: boolean = null;
  public WardName: string = null;
  public IsActive: boolean = true;
  public IsScanned: boolean = true;
  public ScannedBy: number = null;
  public ScannedOn: string = null;

  public ProviderIdInBilling: string = null;
  public ProviderNameInBilling: string = null;
  public PrintCount: number = 0;
  ReportTemplateIdsCSV: string = null;
  ReferredById: number;
  ReferredByName: string;
  ProviderName: any;
  RadiologyNo: any;
  PerformerIdInBilling: any;
  PerformerNameInBilling: any;
  SelectedFooterTemplateId: number = 0;
  FooterTextsList: FooterTextsList_Dto[] = [];
}


export class ImagingReportViewModel {
  public PatientId: number = null;//sud:14Jan'19--for Edit Report
  public PatientCode: string = null;//sud:16Jul'19--needed for edit report.
  public ReportTemplateId: number = null;
  public TemplateName: string = "Not Set";//default value for template.
  public MuncipalityName: string = null;
  public CountrySubDivisionName: string = null;
  public CountryName: string = null;
  public WardNumber: number = null;

  public PatientNameLocal: string = null;
  public BillingDate: string = null;
  public ImagingReportId: number = null;
  public ImagingItemName: string = null;
  public ImagingTypeName: string = null;
  public CreatedOn: string = null;
  public ReportText: any = null;
  public ImageName: string = null;
  public DoctorSignatureJSON: string = null;
  public Signatories: string = null;
  public PatientName: string = null;
  public PhoneNumber: string = null;
  public DateOfBirth: string = null;
  public Gender: string = null;
  public Address: string = null;
  public PatientStudyId: string = "";
  public Indication: string = null;
  public RadiologyNo: string = null;

  public PrescriberName: string = null; // Dev :15June'22 Changed ProviderName to PrescriberName
  public PrescriberId: number = null; // Dev :15June'22 Changed ProviderId to PrescriberId

  public SignatoryImageBase64: string = null;
  public FooterText: string = null;
  public FooterTextsList: FooterTextsList_Dto[] = [];
  public currentLoggedInUserSignature: string = null;
  public PrintCount: number = 0;
  public ReferredById: number = null;//Bikesh: 22nd_July'24 added new entity to referrer
  public ReferredByName: string = null;//Bikesh: 22nd_July'24 added new entity to referrer
  public Age: string = null;
  public SelectedFooterTemplateId: number = 0;
}

export class RadiologyScanDoneDetail {
  public ImagingRequisitionId: number = 0;
  public ScannedOn: string = "";
  public Remarks: string = "";
  public PatientCode: string = "";
  public ShortName: string = "";
  public FilmTypeId: number = null;
  public FilmQuantity: number = null;
}

