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
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("NIS.UserCredentialHistory")]
    public partial class UserCredentialHistoryRecord
    {
        public long Id { get; set; }
        public string UserIdentifier { get; set; }
        public string Password { get; set; }
        public bool IsSystemGenerated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public string TenantCode { get; set; }
    }
}
