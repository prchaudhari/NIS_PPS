//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace nIS
{
    using System;
    using System.Collections.Generic;
    
    public partial class TTD_SubscriptionMaster_Old
    {
        public long Id { get; set; }
        public long BatchId { get; set; }
        public long CustomerId { get; set; }
        public string CustomerCode { get; set; }
        public string VendorName { get; set; }
        public string Subscription { get; set; }
        public string Email { get; set; }
        public Nullable<System.DateTime> StartDate { get; set; }
        public Nullable<System.DateTime> EndDate { get; set; }
        public string TenantCode { get; set; }
    }
}
