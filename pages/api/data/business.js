import dbConnect from "../../../db/database";
import Business from "../../../models/business";

dbConnect();

export default async (req, res) => {
  await getBusiness(req, res);
};

const getBusiness = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ msg: "Please add data." });

    const { businessId } = req.body;
    const business = await Business.findById(businessId);

    // if (!business) {
    //   return res.status(200).json({
    //     businessData: null,
    //   });
    // }

    res.status(200).json({
      business,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};
