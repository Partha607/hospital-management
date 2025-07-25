
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
export class PHRMPatient {
    public PatientId: number = 0;
    public Salutation: string = '';
    public FirstName: string = "";
    public MiddleName: string = null;
    public LastName: string = "";
    public Age: string = null;
    public Address: string = null;
    public CountryId: number = 0;
    public CountrySubDivisionId: number = 0;
    public PhoneNumber: string = "";
    public Gender: string = null;

    public DateOfBirth: string = null;
    public PhoneAcceptsText: boolean = false;
    public AgeUnit: string = 'Y';
    public IsDobVerified: boolean = false;
    public CreatedOn: string = null;
    public CreatedBy: number = null;
    public PatientCode: string = null;
    public IsActive: boolean = true;
    public IsOutdoorPat: boolean = true;
    public ProviderId: number = 0;
    public IsAdmitted: boolean = true;
    public CountrySubDivisionName: string = "";
    CountryName: string = "";
    MunicipalityName: string = "";
    WardNumber: number = 0;
    //only for read purpose
    public ShortName: string = "";
    public PHRMPatientValidator: FormGroup = null;
    public PANNumber: string = "";
    //insurance details
    public NSHINumber: string;
    public LatestClaimCode: number;
    public RemainingBalance: number;
    //sud:23March'21--below SSU fields are going null till db and it's crashing in new admission.
    //these are newly added fields, so it was missing earlier. 
    public IsSSUPatient: boolean = false;
    public SSU_IsActive: boolean = false;

    public MunicipalityId: number = 0;
    public VisitDate: string = null;
    public PriceCategoryId: number = null;
    public DiscountPercent: number = null;
    PatientVisitId: number = null;
    MembershipTypeId: number = null;
    ClaimCode: number = null;
    VisitType: string = "outpatient";
    SchemeId: number = null;
    SchemeName: string = '';
    EthnicGroup: string = "";
    PolicyNo: string = "";

    //Constructor of class
    constructor() {
        var _formBuilder = new FormBuilder();
        this.PHRMPatientValidator = _formBuilder.group({
            'Salutation': [''],
            'FirstName': ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
            'LastName': ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
            'MiddleName': ['', Validators.compose([Validators.maxLength(30)])],
            'PhoneNumber': ['', Validators.compose([Validators.pattern('^[0-9]{1,10}$')])],
            'Address': ['', Validators.compose([Validators.maxLength(30)])],
            'Age': ['', Validators.compose([Validators.required, Validators.maxLength(10)])],
            'Gender': ['', Validators.required],
        });
    }

    //Check is dirt or not control
    public IsDirty(fieldname): boolean {
        if (fieldname == undefined) {
            return this.PHRMPatientValidator.dirty;
        }
        else {
            return this.PHRMPatientValidator.controls[fieldname].dirty;
        }
    }
    //Check Is valid or not control
    public IsValid(): boolean { if (this.PHRMPatientValidator.valid) { return true; } else { return false; } }
    public IsValidCheck(fieldname, validator): boolean {
        // if (this.PHRMPatientValidator.valid) {
        //     return true;
        // }

        // if (fieldname == undefined) {
        //     return this.PHRMPatientValidator.valid;
        // }
        // else {

        //     return !(this.PHRMPatientValidator.hasError(validator, fieldname));
        // }
        if (this.PHRMPatientValidator.valid) {
            return true;
        }

        if (fieldname == undefined) {
            return this.PHRMPatientValidator.valid;
        }
        else {
            return !(this.PHRMPatientValidator.hasError(validator, fieldname));
        }
    }

    public EnableControl(formControlName: string, enabled: boolean) {

        let currCtrol = this.PHRMPatientValidator.controls[formControlName];
        if (currCtrol) {
            if (enabled) {
                currCtrol.enable();
            }
            else {
                currCtrol.disable();
            }
        }
    }
}
