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

    [Table("NIS.RolePrivilege")]
    public partial class RolePrivilegeRecord
    {
        public long Id { get; set; }
        public long RoleIdentifier { get; set; }
        public string EntityName { get; set; }
        public string Operation { get; set; }
        public bool IsEnable { get; set; }
    }
}
