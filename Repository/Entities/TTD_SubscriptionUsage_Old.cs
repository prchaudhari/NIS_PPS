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
    
    public partial class TTD_SubscriptionUsage_Old
    {
        public long Id { get; set; }
        public long BatchId { get; set; }
        public long CustomerId { get; set; }
        public string Subscription { get; set; }
        public string VendorName { get; set; }
        public string Email { get; set; }
        public decimal Usage { get; set; }
        public long Emails { get; set; }
        public long Meetings { get; set; }
        public string TenantCode { get; set; }
    }
}
