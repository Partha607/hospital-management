﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DanpheEMR.ServerModel
{
    public class ImagingReportModel
    {
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int ImagingReportId { get; set; }
        [Key, ForeignKey("ImagingRequisition")]
        public int ImagingRequisitionId { get; set; }
        public int? PatientVisitId { get; set; }
        public int PatientId { get; set; }
        public string PrescriberName { get; set; }
        public int? ImagingTypeId { get; set; }
        public string ImagingTypeName { get; set; }
        public int? ImagingItemId { get; set; }
        public string ImagingItemName { get; set; }
        public string ImageFullPath { get; set; }
        public string ImageName { get; set; }
        public string ReportText { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string Signatories { get; set; }
        public string OrderStatus { get; set; }
        public int? PrescriberId { get; set; }
        public int? CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int? ReportTemplateId { get; set; }
        public string PatientStudyId { get; set; }
        public virtual VisitModel Visit { get; set; }
        public virtual PatientModel Patient { get; set; }

        public string Indication { get; set; }
        public string RadiologyNo { get; set; }
        public int? PerformerId { get; set; }
        public long? PatientFileId { get; set; }
        public string PerformerName { get; set; }

        public virtual ImagingRequisitionModel ImagingRequisition { get; set; }

        [NotMapped]
        public string PerformerNameInBilling { get; set; }
        [NotMapped]
        public int? PerformerIdInBilling { get; set; }
        public int PrintCount { get; set; }
        public int? ReferredById {  get; set; }
        public string ReferredByName { get; set; }
        public string ReportTemplateIdsCSV { get; set; }
        [NotMapped]
        public List<FooterText> FooterTextsList { get; set; }
        public int? SelectedFooterTemplateId { get; set; }
    }

    public class ImagingReportViewModel
    {
        public int PatientId { get; set; }//sud:14Jan'19--needed for Edit Report // remove if not required.
        public int? ReportTemplateId { get; set; }//sud:14Jan'19--needed for Edit Report // remove if not required.
        public string TemplateName { get; set; }//sud:14Jan'19--needed for Edit Report // remove if not required.

        public int ImagingReportId { get; set; }
        public int ImagingRequisitionId { get; set; }
        public string ImagingItemName { get; set; }
        public string ImagingTypeName { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? BillingDate { get; set; }
        public string ReportText { get; set; }
        public string ImageName { get; set; }
        public string PhoneNumber { get; set; }
        public string PatientCode { get; set; }
        public string PatientName { get; set; }
        public string Address { get; set; }
        //public string DoctorSignatureJSON { get; set; }
        public string Signatories { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? ScannedOn { get; set; }
        public string Gender { get; set; }
        public string PatientStudyId { get; set; }
        public string PrescriberName { get; set; } // Dev :15June'22 Changed ProviderName to PrescriberName
        public string CountryName { get; set; }

        public string MunicipalityName { get; set; }
        public string CountrySubDivisionName { get; set; }
        public Int16? WardNumber { get; set; }

        public int? PrescriberId { get; set; } // Dev :15June'22 Changed ProviderId to PrescriberId
        public int? PerformerId { get; set; } // Dev :15June'22 Changed ReportingDoctorId to PerformerId
        public string PerformerName { get; set; } // Dev :15June'22 Changed ReportingDoctorName to PerformerName
        public int? ReferredById { get; set; } //Bikesh: 22July'24 Added referredbyId to view referrer in imaging report list
        public string ReferredByName { get; set; }//Bikesh: 22July'24 Added ReferrerName to view referrer in imaging report list
        public string Indication { get; set; }
        public string RadiologyNo { get; set; }

        public string SignatoryImageBase64 { get; set; }
        public string FooterText { get; set; }

        public string currentLoggedInUserSignature { get; set; }
        public bool? HasInsurance { get; set; }
        public bool? IsActive { get; set; }

        public string PatientNameLocal { get; set; }
        public int PrintCount { get; set; }
        public long? PatientFileId { get; set; }
        public string ReportTemplateIdsCSV { get; set; }
        [NotMapped]
        public List<FooterText> FooterTextsList { get; set; }
        public int? SelectedFooterTemplateId { get; set; }

    }
    public class FooterText
    {

        public int? SelectedFooterTemplateId { get; set; }
        public string Text { get; set; }
        public bool IsChecked { get; set; }
    }
}
