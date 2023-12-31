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
    
    public partial class Entity
    {
        public long Id { get; set; }
        public string EntityName { get; set; }
        public string Keys { get; set; }
        public string AssemblyName { get; set; }
        public string NamespaceName { get; set; }
        public string Operations { get; set; }
        public string ComponentCode { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public Nullable<bool> IsImportEnabled { get; set; }
        public string ServiceURL { get; set; }
        public string TenantCode { get; set; }
        public Nullable<bool> IsDefaultEntity { get; set; }
        public string DisplayName { get; set; }
    }
}
