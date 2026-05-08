const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function migrateExams() {
  console.log('Bắt đầu cập nhật creatorUid cho collection "exams"...\n');

  // 1. Lấy danh sách user để đối chiếu Tên -> UID
  const usersSnap = await db.collection('users').get();
  const nameToUid = {};
  usersSnap.forEach(doc => {
    const { fullName } = doc.data();
    if (fullName) nameToUid[fullName.trim()] = doc.id;
  });

  // 2. Xử lý collection exams
  const examsSnap = await db.collection('exams').get();
  let batch = db.batch();
  let updated = 0, skipped = 0, opCount = 0;

  for (const doc of examsSnap.docs) {
    const data = doc.data();
    
    // Nếu đã có creatorUid thì bỏ qua
    if (data.creatorUid) { skipped++; continue; }

    const uid = nameToUid[data.creatorName?.trim()];

    if (uid) {
      batch.update(doc.ref, { creatorUid: uid });
      updated++;
      opCount++;
    } else {
      console.log(`  - Cảnh báo: Không tìm thấy UID cho đề thi của "${data.creatorName}" (ID: ${doc.id})`);
    }

    if (opCount === 400) {
      await batch.commit();
      batch = db.batch();
      opCount = 0;
    }
  }

  if (opCount > 0) await batch.commit();

  console.log(`\n--- KẾT QUẢ ---`);
  console.log(`Đã cập nhật creatorUid: ${updated}`);
  console.log(`Đã có UID từ trước    : ${skipped}`);
  process.exit(0);
}

migrateExams().catch(console.error);