//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace NedbankRepository
{
    using System;
    using System.Collections.Generic;
    
    public partial class MultiTenantUserAccessMap
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string AssociatedTenantCode { get; set; }
        public string OtherTenantCode { get; set; }
        public long OtherTenantAccessRoleId { get; set; }
        public string ParentTenantCode { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public long LastUpdatedBy { get; set; }
        public System.DateTime LastUpdatedDate { get; set; }
    }
}
