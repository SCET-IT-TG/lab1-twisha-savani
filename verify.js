/**
 * MongoDB Auto-Grader for Exercises 1–7
 * Compatible with GitHub Classroom Autograding
 */

const { MongoClient, ObjectId } = require("mongodb");

const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "examDB";

async function verify() {
  let score = 0;
  const report = [];

  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(DB_NAME);

  /* -------------------------------------------------
     Exercise 1: Database & Collection Creation
  ------------------------------------------------- */
  try {
    const students = db.collection("students");
    const count = await students.countDocuments();
    if (count >= 2) {
      score += 10;
      report.push("Exercise 1: PASS");
    } else {
      report.push("Exercise 1: FAIL (less than 2 student documents)");
    }
  } catch {
    report.push("Exercise 1: FAIL (students collection missing)");
  }

  /* -------------------------------------------------
     Exercise 2: Required Fields in students
  ------------------------------------------------- */
  try {
    const students = await db.collection("students").find().toArray();
    const valid = students.every(
      s =>
        s.name &&
        s.department &&
        s.semester !== undefined &&
        s.mobile
    );
    if (valid && students.length > 0) {
      score += 10;
      report.push("Exercise 2: PASS");
    } else {
      report.push("Exercise 2: FAIL (missing required fields, make sure all students documents have at least four fields (name,department,semester and mobile)");
    }
  } catch {
    report.push("Exercise 2: FAIL");
  }

  /* -------------------------------------------------
     Exercise 3: Array of Simple Values
  ------------------------------------------------- */
  try {
    const doc = await db.collection("subjects").findOne();
    if (doc && Array.isArray(doc.subject_list)) {
      score += 10;
      report.push("Exercise 3: PASS");
    } else {
      report.push("Exercise 3: FAIL (subject_list not an array)");
    }
  } catch {
    report.push("Exercise 3: FAIL (subjects collection missing)");
  }

  /* -------------------------------------------------
     Exercise 4: Array of Objects
  ------------------------------------------------- */
  try {
    const doc = await db.collection("faculty").findOne();
    const valid =
      doc &&
      Array.isArray(doc.teachers) &&
      doc.teachers.every(
        t => t.name && t.experience !== undefined
      );

    if (valid) {
      score += 10;
      report.push("Exercise 4: PASS");
    } else {
      report.push("Exercise 4: FAIL (teachers array invalid)");
    }
  } catch {
    report.push("Exercise 4: FAIL (faculty collection missing)");
  }

  /* -------------------------------------------------
     Exercise 5: Explicit _id using ObjectId()
  ------------------------------------------------- */
  try {
    const docs = await db.collection("students").find().toArray();
    const hasObjectId = docs.some(
      d => d._id && d._id._bsontype === "ObjectId"
    );

    if (hasObjectId) {
      score += 10;
      report.push("Exercise 5: PASS");
    } else {
      report.push("Exercise 5: FAIL (_id not ObjectId)");
    }
  } catch {
    report.push("Exercise 5: FAIL");
  }

  /* -------------------------------------------------
     Exercise 6: Duplicate _id Observation
     (Check uniqueness enforcement)
  ------------------------------------------------- */
  try {
    const docs = await db.collection("students").find().toArray();
    const ids = docs.map(d => d._id.toString());
    const uniqueIds = new Set(ids);

    if (ids.length === uniqueIds.size) {
      score += 10;
      report.push("Exercise 6: PASS");
    } else {
      report.push("Exercise 6: FAIL (duplicate _id found)");
    }
  } catch {
    report.push("Exercise 6: FAIL");
  }

  /* -------------------------------------------------
     Exercise 7: Multiple Inserts
  ------------------------------------------------- */
  try {
    const count = await db.collection("students").countDocuments();
    if (count >= 3) {
      score += 10;
      report.push("Exercise 7: PASS");
    } else {
      report.push("Exercise 7: FAIL (less than 3 documents)");
    }
  } catch {
    report.push("Exercise 7: FAIL");
  }

  /* -------------------------------------------------
     FINAL REPORT
  ------------------------------------------------- */
  console.log("========== MongoDB Auto-Grading Report ==========");
  report.forEach(r => console.log(r));
  console.log("-----------------------------------------------");
  console.log(`TOTAL SCORE: ${score} / 70`);

  await client.close();

  // Required for GitHub Classroom
  process.exit(score === 70 ? 0 : 1);
}

verify().catch(err => {
  console.error("Autograder crashed:", err);
  process.exit(1);
});
