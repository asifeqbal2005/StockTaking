using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Specifications
{
    public class StockAllotmentSpecification : BaseSpecification<StockAllotment>
    {
        public StockAllotmentSpecification(bool isDelete = false)
           : base(i => (i.IsDelete == isDelete))
        {
            
        }

        public StockAllotmentSpecification(long operatorId, bool isDelete = false)
          : base(i => ((i.OperatorId1 == operatorId) || (i.OperatorId2 == operatorId)) && (i.IsDelete == isDelete))
        {

        }

        public StockAllotmentSpecification(long operatorId, bool isOper1Start, bool isOper1Complete,  bool isDelete = false)
          : base(i => (i.OperatorId1 == operatorId) 
          && (i.IsOper1Start == isOper1Start && i.IsOper1Complete == isOper1Complete) 
          && (i.IsDelete == isDelete))
        {

        }

        public StockAllotmentSpecification(long operatorId, bool isOper1Start, bool isOper1Complete, bool isOper2Start, bool isOper2Complete, bool isDelete = false) 
            : base(i => (i.OperatorId2 == operatorId)
            && (i.IsOper1Start == isOper1Start && i.IsOper1Complete == isOper1Complete)
            && (i.IsOper2Start == isOper2Start && i.IsOper2Complete == isOper2Complete)
            && (i.IsDelete == isDelete))
        {

        }

        public StockAllotmentSpecification(bool isOper1Start, bool isOper1Complete, bool isOper2Start, bool isOper2Complete, bool isSupervisorSubmit, bool isDelete = false)
            : base(i => (i.IsOper1Start == isOper1Start && i.IsOper1Complete == isOper1Complete)
            && (i.IsOper2Start == isOper2Start && i.IsOper2Complete == isOper2Complete) && (i.IsSupervisorSubmit == isSupervisorSubmit)
            && (i.IsDelete == isDelete))
        {

        }

        public StockAllotmentSpecification(string row, bool isOper1Start, bool isOper1Complete, bool isOper2Start, bool isOper2Complete, bool isDelete = false)
            : base(i => (i.Row == row) && (i.IsOper1Start == isOper1Start && i.IsOper1Complete == isOper1Complete)
            && (i.IsOper2Start == isOper2Start && i.IsOper2Complete == isOper2Complete)
            && (i.IsDelete == isDelete))
        {

        }

        public StockAllotmentSpecification(bool isOper1Start, bool isOper1Complete, bool isOper2Start, bool isOper2Complete, bool isSupervisorSubmit, bool isManagerFinalize, bool isDelete = false)
            : base(i => (i.IsOper1Start == isOper1Start && i.IsOper1Complete == isOper1Complete)
            && (i.IsOper2Start == isOper2Start && i.IsOper2Complete == isOper2Complete) && (i.IsSupervisorSubmit == isSupervisorSubmit)
            && (i.IsManagerFinalize == isManagerFinalize) && (i.IsDelete == isDelete))
        {

        }

        public StockAllotmentSpecification(string row, bool isOper1Start, bool isOper1Complete, bool isOper2Start, bool isOper2Complete, bool isSupervisorSubmit, bool isDelete = false)
            : base(i => (i.Row == row) && (i.IsOper1Start == isOper1Start && i.IsOper1Complete == isOper1Complete)
            && (i.IsOper2Start == isOper2Start && i.IsOper2Complete == isOper2Complete) && (i.IsSupervisorSubmit == isSupervisorSubmit)
            && (i.IsDelete == isDelete))
        {

        }
    }
}
