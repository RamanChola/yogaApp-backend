const db = require("../db");
const { v4: uuidv4 } = require("uuid");

const subscribe = async (req, res) => {
  const { client_id, plan_id } = req.body;
  let date_ob = new Date();
  let day = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let lastDayOfMonth = new Date(
    date_ob.getFullYear(),
    date_ob.getMonth() + 1,
    0
  ).getDate();
  let st_date = year + "-" + month + "-" + day;
  let end_date = year + "-" + month + "-" + lastDayOfMonth;
  let sub_id = uuidv4();

  let query1 = `SELECT * FROM Subscriptions WHERE client_id="${client_id}";`;
  let query2 = `SELECT * FROM Plans WHERE plan_id="${plan_id}"`;
  let query3 = `INSERT INTO Subscriptions(sub_id, sub_st, sub_end, client_id, plan_id) VALUES("${sub_id}","${st_date}","${end_date}","${client_id}","${plan_id}")`;
  try {
    let result = await db.query(query1);
    if (result.length > 0) {
      let sub_end = result[0].sub_end;
      if (new Date(sub_end).getTime() >= date_ob.getTime()) {
        // method not allowed
        return res.status(405).json("User Already Subscribed");
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
  try {
    let result = await db.query(query2);
    if (result.length == 0) {
      res.status(404).json("Invalid Plan");
    }
  } catch (error) {
    res.status(500).json(error);
  }
  try {
    const result = await db.query(query3);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const isSubscribed = async (req, res) => {
  const { client_id } = req.params;
  let query = `SELECT * FROM Subscriptions WHERE client_id="${client_id}"`;
  try {
    let result = await db.query(query);
    if (result.length != 0) {
      let sub_end = result[0].sub_end;
      if (new Date(sub_end).getTime() < new Date().getTime()) {
        // expired
        try {
          await db.query(
            `DELETE FROM Subscriptions WHERE client_id = "${client_id}"`
          );
        } catch (error) {
          console.log(error);
        }
        res.status(200).json(false);
      } else {
        res.status(200).json(true);
      }
    } else {
      res.status(200).json(false);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const getPlans = async (req, res) => {
  let query = `SELECT * FROM Plans`;
  let plans;
  try {
    plans = await db.query(query);
  } catch (err) {
    res.status(500).json(err);
  }
  if (plans.length == 0) {
    return res.status(404).json("No Plans Available");
  }
  res.status(200).json({
    plans,
  });
};

const getSubscriptionDetails = async (req, res) => {
  const { client_id } = req.params;
  let query = `SELECT Plans.batch_time, Subscriptions.sub_end
  FROM Subscriptions
  INNER JOIN Plans ON Plans.plan_id = Subscriptions.plan_id 
  WHERE Subscriptions.client_id = "${client_id}"`;
  let details;
  try {
    details = await db.query(query);
  } catch (err) {
    res.status(500).json(err);
  }
  res.status(200).json({
    details,
  });
};

module.exports = {
  subscribe,
  isSubscribed,
  getPlans,
  getSubscriptionDetails,
};
