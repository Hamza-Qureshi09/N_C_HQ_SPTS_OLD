const feeModel = require("../models/YearlyFee")
const classModel = require("../models/Class")

class FeeManage {

    // add fee challan new fee for a year
    async AddFee(req, res) {
        const { Class, FeesTitle, Feesyear, FeesAmount } = req.body;
        if (!Class || !FeesTitle || !Feesyear || !FeesAmount) {
            return res.status(400).json("invalid entry")
        }
        const findClassAndUpdateFee = await classModel.findOneAndUpdate(
            { Cname: Class },
            { Cfee: FeesAmount },
            { new: true, upsert: true }
        );
        if (findClassAndUpdateFee) {
            // adding to fee collection 
            await feeModel({
                Title: FeesTitle,
                Class: findClassAndUpdateFee.Cname,
                FeeYear: Feesyear,
                FeeAmount: FeesAmount
            }).save()
            return res.status(200).json({ message: "fee challan added!" })
        }
        return res.status(400).json({ message: "error occured!" })
    }


    // Get Fee Challans
    async GetFees(req, res) {
        try {
            const query = req.query
            // working on query for filter results
            if (query.q || query._start || query._end || query._sort || query._order) {
                let sortingMethod = query._sort;
                const Fees = await feeModel.find(query.q && { Title: query.q }).skip(query._start).limit(query._end - query._start).sort(sortingMethod === "Class" ? { Class: 1 } : sortingMethod === "Amount" ? { FeeAmount: 1 } : { _id: 1 });
                return res.status(200).json(Fees.map((val) => {
                    return (
                        {
                            id: val._id,
                            Title: val.Title ? val.Title : "",
                            Class: val.Class ? val.Class : "",
                            FeeYear: val.FeeYear ? val.FeeYear : "",
                            FeeAmount: val.FeeAmount ? val.FeeAmount : "",
                        }
                    )
                }))
            }
            const Fees = await feeModel.find({});// getting all classses
            return res.status(200).json(Fees.map((val) => {
                return (
                    {
                        id: val._id,
                        Title: val.Title ? val.Title : "",
                        Class: val.Class ? val.Class : "",
                        FeeYear: val.FeeYear ? val.FeeYear : "",
                        FeeAmount: val.FeeAmount ? val.FeeAmount : "",
                    }
                )
            }))
        } catch (error) {
            console.log(error);
            return res.status(400).json("error occured")
        }
    }


    // get single class for update
    async GetSingleFee(req, res) {
        let params = req.params.id;
        const findSingleFee = await feeModel.findOne({ _id: params });
        res.status(200).json({
            id: findSingleFee._id,
            Title: findSingleFee.Title ? findSingleFee.Title : "",
            Class: findSingleFee.Class ? findSingleFee.Class : "",
            FeeYear: findSingleFee.FeeYear ? findSingleFee.FeeYear : "",
            FeeAmount: findSingleFee.FeeAmount ? findSingleFee.FeeAmount : "",
        })
    }


    // getting single classs
    async UpdateSingleClass(req, res) {
        const { Id, className, Fee } = req.body;
        const findClassandUpdate = await classModel.findByIdAndUpdate(
            { _id: Id },
            {
                Cname: className,
                Cfee: Fee
            },
            { new: true, upsert: true }
        )
        res.status(200).json(Singleutils(findClassandUpdate))
    }


    //updating single class
      async UpdateFee(req,res){
        const {Id,Class, FeesTitle, Feesyear, FeesAmount}=req.body
        if (!Class || !FeesTitle || !Feesyear  || !FeesAmount ||!Id) {
            return res.status(400).json("Incomplete Details!")
        }
        await feeModel.findByIdAndUpdate(
            {_id:Id},
            {
                Title:FeesTitle,
                FeeYear:Feesyear,
                FeeAmount:FeesAmount,
                Class:Class
            },
            {new:true,upsert:true}
        )
        return res.status(200).json("update successfully!")
    }

    // removing fee challan
    async RemoveSingelFeeChallan(req, res) {
        const { Id } = req.body;
        console.log(Id)
        const deleterecord = await feeModel.findByIdAndDelete(
            { _id: Id }
        )
        if (deleterecord) {
            return res.status(200).json("Row Deleted!")
        }
        return res.status(400).json("Row Deleted!")
    }

}

module.exports = new FeeManage()