import { PrismaClient, ProjectStatus, TaskStatus, Priority, CalendarCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for StudyFlow...');

  // 1. Seed or update primary user
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'intan.zahra@uny.ac.id' },
    update: {
      name: 'Intan Zahra',
      passwordHash,
      role: 'Student',
      university: 'UNY',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    create: {
      email: 'intan.zahra@uny.ac.id',
      name: 'Intan Zahra',
      passwordHash,
      role: 'Student',
      university: 'UNY',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  console.log(`👤 User ready: ${user.name} (${user.email})`);

  // 2. Folders
  const folderSkripsi = await prisma.folder.upsert({
    where: { id: 'fld_skripsi' },
    update: {},
    create: {
      id: 'fld_skripsi',
      userId: user.id,
      name: 'Skripsi',
    },
  });

  const folderTugas = await prisma.folder.upsert({
    where: { id: 'fld_tugas' },
    update: {},
    create: {
      id: 'fld_tugas',
      userId: user.id,
      name: 'Tugas Kuliah',
    },
  });

  const folderPK = await prisma.folder.upsert({
    where: { id: 'fld_pk' },
    update: {},
    create: {
      id: 'fld_pk',
      userId: user.id,
      name: 'Laporan PK',
    },
  });

  // 3. Projects
  // Project 1: Skripsi (75% completed)
  const projSkripsi = await prisma.project.upsert({
    where: { id: 'proj_skripsi' },
    update: {
      title: 'Skripsi',
      subtitle: 'Bab I - III',
      description: 'Pengaruh Paparan Hoaks di Era Post-Truth terhadap Partisipasi Politik Generasi Z di Kabupaten Kulon Progo',
      status: ProjectStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      category: 'Skripsi',
      deadline: new Date('2027-01-20T17:00:00Z'),
    },
    create: {
      id: 'proj_skripsi',
      userId: user.id,
      title: 'Skripsi',
      subtitle: 'Bab I - III',
      description: 'Pengaruh Paparan Hoaks di Era Post-Truth terhadap Partisipasi Politik Generasi Z di Kabupaten Kulon Progo',
      status: ProjectStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      category: 'Skripsi',
      deadline: new Date('2027-01-20T17:00:00Z'),
    },
  });

  // Project 2: Makalah PPKn (40% completed)
  const projPPKn = await prisma.project.upsert({
    where: { id: 'proj_pancasila' },
    update: {
      title: 'Makalah PPKn',
      subtitle: 'Draft & Referensi',
      description: 'Pancasila dalam Kehidupan Berbangsa dan Bernegara di Era Globalisasi',
      status: ProjectStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
      category: 'Tugas Kuliah',
      deadline: new Date('2026-11-30T17:00:00Z'),
    },
    create: {
      id: 'proj_pancasila',
      userId: user.id,
      title: 'Makalah PPKn',
      subtitle: 'Draft & Referensi',
      description: 'Pancasila dalam Kehidupan Berbangsa dan Bernegara di Era Globalisasi',
      status: ProjectStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
      category: 'Tugas Kuliah',
      deadline: new Date('2026-11-30T17:00:00Z'),
    },
  });

  // Project 3: Laporan PK (80% completed)
  const projPK = await prisma.project.upsert({
    where: { id: 'proj_laporan_pk' },
    update: {
      title: 'Laporan PK',
      subtitle: 'Finalisasi Laporan',
      description: 'Laporan Praktik Kependidikan di SMP Negeri 1 Ngemplak Sleman Yogyakarta',
      status: ProjectStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      category: 'Praktik Kependidikan',
      deadline: new Date('2026-12-15T17:00:00Z'),
    },
    create: {
      id: 'proj_laporan_pk',
      userId: user.id,
      title: 'Laporan PK',
      subtitle: 'Finalisasi Laporan',
      description: 'Laporan Praktik Kependidikan di SMP Negeri 1 Ngemplak Sleman Yogyakarta',
      status: ProjectStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      category: 'Praktik Kependidikan',
      deadline: new Date('2026-12-15T17:00:00Z'),
    },
  });

  // Project 4: PLK UNY Mengabdi (0% completed)
  const projPLK = await prisma.project.upsert({
    where: { id: 'proj_plk_mengabdi' },
    update: {
      title: 'PLK UNY Mengabdi',
      subtitle: 'Inisiasi Program',
      description: 'Pengabdian Literasi Kewarganegaraan bagi Pemuda Pesisir Pantai Glagah',
      status: ProjectStatus.PLANNING,
      priority: Priority.LOW,
      category: 'Pengabdian Masyarakat',
      deadline: new Date('2027-02-28T17:00:00Z'),
    },
    create: {
      id: 'proj_plk_mengabdi',
      userId: user.id,
      title: 'PLK UNY Mengabdi',
      subtitle: 'Inisiasi Program',
      description: 'Pengabdian Literasi Kewarganegaraan bagi Pemuda Pesisir Pantai Glagah',
      status: ProjectStatus.PLANNING,
      priority: Priority.LOW,
      category: 'Pengabdian Masyarakat',
      deadline: new Date('2027-02-28T17:00:00Z'),
    },
  });

  // 4. Tasks & Synchronized Calendar Events
  const skripsiTasks = [
    { id: 'tsk_skr_1', title: 'Penyusunan Proposal Bab I', status: TaskStatus.COMPLETED, position: 1, completedAt: new Date('2026-10-15') },
    { id: 'tsk_skr_2', title: 'Kajian Teori Bab II', status: TaskStatus.COMPLETED, position: 2, completedAt: new Date('2026-10-28') },
    { id: 'tsk_skr_3', title: 'Metode Penelitian Bab III', status: TaskStatus.COMPLETED, position: 3, completedAt: new Date('2026-11-03') },
    { id: 'tsk_skr_4', title: 'Seminar Proposal Skripsi', status: TaskStatus.COMPLETED, position: 4, completedAt: new Date('2026-11-05') },
    { id: 'tsk_skr_5', title: 'Revisi Bab I-III pasca sempro', status: TaskStatus.COMPLETED, position: 5, completedAt: new Date('2026-11-08') },
    { id: 'tsk_skr_6', title: 'Uji Validitas Instrumen', status: TaskStatus.COMPLETED, position: 6, completedAt: new Date('2026-11-09') },
    { id: 'tsk_skr_7', title: 'Penyusunan Bab IV - Hasil & Pembahasan', status: TaskStatus.IN_PROGRESS, position: 7, deadline: new Date('2026-11-25T17:00:00Z') },
    { id: 'tsk_skr_8', title: 'Bab V - Kesimpulan & Saran', status: TaskStatus.TODO, position: 8, deadline: new Date('2026-12-10T17:00:00Z') },
  ];

  for (const t of skripsiTasks) {
    const task = await prisma.task.upsert({
      where: { id: t.id },
      update: {
        projectId: projSkripsi.id,
        title: t.title,
        status: t.status,
        position: t.position,
        deadline: t.deadline,
        completedAt: t.completedAt,
      },
      create: {
        id: t.id,
        userId: user.id,
        projectId: projSkripsi.id,
        title: t.title,
        status: t.status,
        position: t.position,
        deadline: t.deadline,
        completedAt: t.completedAt,
      },
    });

    if (t.deadline) {
      const isTaskCompleted = (t.status as any) === TaskStatus.COMPLETED;
      await prisma.calendarEvent.upsert({
        where: { id: `evt_${t.id}` },
        update: {
          title: t.title,
          startAt: t.deadline,
          completed: isTaskCompleted,
        },
        create: {
          id: `evt_${t.id}`,
          userId: user.id,
          projectId: projSkripsi.id,
          taskId: task.id,
          title: t.title,
          category: CalendarCategory.DEADLINE,
          startAt: t.deadline,
          completed: isTaskCompleted,
        },
      });
    }
  }

  // Makalah PPKn Tasks (2 completed out of 5 = 40%)
  const ppknTasks = [
    { id: 'tsk_ppkn_1', title: 'Studi Literatur Pancasila', status: TaskStatus.COMPLETED, position: 1 },
    { id: 'tsk_ppkn_2', title: 'Penyusunan Latar Belakang & Rumusan Masalah', status: TaskStatus.COMPLETED, position: 2 },
    { id: 'tsk_ppkn_3', title: 'Analisis Tantangan Era Globalisasi', status: TaskStatus.IN_PROGRESS, position: 3, deadline: new Date('2026-11-14T17:00:00Z') },
    { id: 'tsk_ppkn_4', title: 'Review Sitasi APA Style', status: TaskStatus.TODO, position: 4, deadline: new Date('2026-11-20T17:00:00Z') },
    { id: 'tsk_ppkn_5', title: 'Pengumpulan Makalah Final', status: TaskStatus.TODO, position: 5, deadline: new Date('2026-11-30T17:00:00Z') },
  ];

  for (const t of ppknTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {
        projectId: projPPKn.id,
        title: t.title,
        status: t.status,
        position: t.position,
        deadline: t.deadline,
      },
      create: {
        id: t.id,
        userId: user.id,
        projectId: projPPKn.id,
        title: t.title,
        status: t.status,
        position: t.position,
        deadline: t.deadline,
      },
    });
  }

  // Laporan PK Tasks (4 completed out of 5 = 80%)
  const pkTasks = [
    { id: 'tsk_pk_1', title: 'Pelaksanaan Mengajar Terbimbing', status: TaskStatus.COMPLETED, position: 1 },
    { id: 'tsk_pk_2', title: 'Pengumpulan Dokumentasi & RPP', status: TaskStatus.COMPLETED, position: 2 },
    { id: 'tsk_pk_3', title: 'Penyusunan Draft Laporan Bab 1-3', status: TaskStatus.COMPLETED, position: 3 },
    { id: 'tsk_pk_4', title: 'Evaluasi Pembimbing Sekolah', status: TaskStatus.COMPLETED, position: 4 },
    { id: 'tsk_pk_5', title: 'Pengesahan & Submit Laporan Akhir', status: TaskStatus.IN_PROGRESS, position: 5, deadline: new Date('2026-12-15T17:00:00Z') },
  ];

  for (const t of pkTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {
        projectId: projPK.id,
        title: t.title,
        status: t.status,
        position: t.position,
        deadline: t.deadline,
      },
      create: {
        id: t.id,
        userId: user.id,
        projectId: projPK.id,
        title: t.title,
        status: t.status,
        position: t.position,
        deadline: t.deadline,
      },
    });
  }

  // PLK UNY Mengabdi Tasks (0 completed out of 4 = 0%)
  const plkTasks = [
    { id: 'tsk_plk_1', title: 'Survei Lokasi Desa Pengabdian', status: TaskStatus.TODO, position: 1 },
    { id: 'tsk_plk_2', title: 'Penyusunan Proposal Kegiatan', status: TaskStatus.TODO, position: 2 },
    { id: 'tsk_plk_3', title: 'Koordinasi dengan Karang Taruna', status: TaskStatus.TODO, position: 3 },
    { id: 'tsk_plk_4', title: 'Pelaksanaan Workshop Literasi', status: TaskStatus.TODO, position: 4 },
  ];

  for (const t of plkTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {
        projectId: projPLK.id,
        title: t.title,
        status: t.status,
        position: t.position,
      },
      create: {
        id: t.id,
        userId: user.id,
        projectId: projPLK.id,
        title: t.title,
        status: t.status,
        position: t.position,
      },
    });
  }

  // 5. Additional Calendar Events matching design
  const additionalEvents = [
    { id: 'ce_bimbingan_1', title: 'Bimbingan Dosen Pembimbing', category: CalendarCategory.CONSULTATION, startAt: new Date('2026-11-12T09:00:00Z'), completed: false },
    { id: 'ce_bimbingan_2', title: 'Konsultasi Olah Data SPSS', category: CalendarCategory.DATA_COLLECTION, startAt: new Date('2026-11-18T13:30:00Z'), completed: false },
    { id: 'ce_sidang_skripsi', title: 'Sidang Skripsi', category: CalendarCategory.DEADLINE, startAt: new Date('2027-01-20T08:00:00Z'), completed: false },
  ];

  for (const evt of additionalEvents) {
    await prisma.calendarEvent.upsert({
      where: { id: evt.id },
      update: {
        title: evt.title,
        category: evt.category,
        startAt: evt.startAt,
        completed: evt.completed,
      },
      create: {
        id: evt.id,
        userId: user.id,
        projectId: projSkripsi.id,
        title: evt.title,
        category: evt.category,
        startAt: evt.startAt,
        completed: evt.completed,
      },
    });
  }

  // 6. Documents
  const docBab1 = await prisma.document.upsert({
    where: { id: 'doc_bab1' },
    update: {},
    create: {
      id: 'doc_bab1',
      userId: user.id,
      projectId: projSkripsi.id,
      folderId: folderSkripsi.id,
      title: 'Bab I – Pendahuluan',
      content: `<h2>BAB I<br/>PENDAHULUAN</h2>
<h3>A. Latar Belakang Masalah</h3>
<p>Di era disrupsi informasi dan percepatan digital, perkembangan media sosial telah mengubah lanskap komunikasi politik secara mendasar. Generasi Z yang tumbuh sebagai <em>digital native</em> menjadi kelompok yang paling rentan terhadap arus informasi yang masif, termasuk persebaran hoaks dan berita palsu (<em>fake news</em>).</p>
<p>Fenomena ini menuntut adanya daya kritis dan literasi digital yang mumpuni agar dinamika demokrasi tetap sehat dan partisipatif, khususnya di kalangan pemilih muda di wilayah Kabupaten Kulon Progo.</p>
<h3>B. Rumusan Masalah</h3>
<ol>
  <li>Bagaimana tingkat paparan hoaks di kalangan Generasi Z di Kabupaten Kulon Progo?</li>
  <li>Bagaimana tingkat partisipasi politik Generasi Z di Kabupaten Kulon Progo?</li>
  <li>Apakah terdapat pengaruh signifikan antara paparan hoaks terhadap tingkat partisipasi politik pemuda?</li>
</ol>
<h3>C. Tujuan Penelitian</h3>
<p>Penelitian ini bertujuan untuk mendeskripsikan secara empiris sejauh mana hoaks media sosial memengaruhi preferensi serta aksi partisipasi politik pemilih pemula.</p>`,
      wordCount: 1254,
      characterCount: 7892,
    },
  });

  const docBab2 = await prisma.document.upsert({
    where: { id: 'doc_bab2' },
    update: {},
    create: {
      id: 'doc_bab2',
      userId: user.id,
      projectId: projSkripsi.id,
      folderId: folderSkripsi.id,
      title: 'Bab II – Kajian Teori',
      content: `<h2>BAB II<br/>KAJIAN TEORI DAN KERANGKA BERPIKIR</h2>
<h3>A. Kajian Teori</h3>
<p>Teori Uses and Gratification serta Teori Partisipasi Politik Verba dkk.</p>`,
      wordCount: 3420,
      characterCount: 21400,
    },
  });

  const docBab3 = await prisma.document.upsert({
    where: { id: 'doc_bab3' },
    update: {},
    create: {
      id: 'doc_bab3',
      userId: user.id,
      projectId: projSkripsi.id,
      folderId: folderSkripsi.id,
      title: 'Bab III – Metode Penelitian',
      content: `<h2>BAB III<br/>METODE PENELITIAN</h2>
<h3>A. Pendekatan dan Jenis Penelitian</h3>
<p>Metode kuantitatif dengan pendekatan korelasional survey.</p>`,
      wordCount: 2150,
      characterCount: 13500,
    },
  });

  const docCatatan = await prisma.document.upsert({
    where: { id: 'doc_catatan_bimbingan' },
    update: {},
    create: {
      id: 'doc_catatan_bimbingan',
      userId: user.id,
      projectId: projSkripsi.id,
      folderId: folderSkripsi.id,
      title: 'Catatan Bimbingan',
      content: `<h2>Catatan Bimbingan Dosen Pembimbing</h2>
<p>- Pertajam gap penelitian di latar belakang.<br/>- Perjelas definisi operasional variabel independen.</p>`,
      wordCount: 450,
      characterCount: 2800,
    },
  });

  // 7. References
  await prisma.reference.upsert({
    where: { id: 'ref_1' },
    update: {},
    create: {
      id: 'ref_1',
      userId: user.id,
      projectId: projSkripsi.id,
      title: 'Digital Media & Youth Political Engagement',
      author: 'Bennett, W. L. & Shah, D.',
      publicationYear: '2021',
      url: 'https://doi.org/10.1080/01972243',
      description: 'Studi komprehensif tentang perilaku media digital dan keterlibatan politik generasi muda.',
      citation: 'Bennett, W. L., & Shah, D. (2021). Digital Media & Youth Political Engagement.',
    },
  });

  await prisma.reference.upsert({
    where: { id: 'ref_2' },
    update: {},
    create: {
      id: 'ref_2',
      userId: user.id,
      projectId: projSkripsi.id,
      title: 'Hoax and Social Media in Indonesia',
      author: 'Nugroho, Y. & Syarief, S.',
      publicationYear: '2022',
      url: 'https://ejournal.undip.ac.id',
      description: 'Dinamika penyebaran disinformasi pemilu di Indonesia.',
      citation: 'Nugroho, Y., & Syarief, S. (2022). Hoax and Social Media in Indonesia.',
    },
  });

  // 8. Notes
  await prisma.note.upsert({
    where: { id: 'note_1' },
    update: {},
    create: {
      id: 'note_1',
      userId: user.id,
      projectId: projSkripsi.id,
      title: 'Masukan Dosen Pembimbing 1',
      content: 'Pastikan kuesioner menggunakan skala Likert 1-5 dan diuji coba ke minimal 30 responden.',
    },
  });

  // 9. Writing Sessions (for real productivity metrics: 8.5k words, 32h focus, 12-day streak)
  const now = new Date();
  const sessionDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  for (const dayAgo of sessionDays) {
    const sessionDate = new Date(now.getTime() - dayAgo * 24 * 60 * 60 * 1000);
    const durationMin = 150 + (dayAgo % 3) * 30; // ~2.5 - 3.5 hours per day
    const words = 500 + (dayAgo % 4) * 200;

    await prisma.writingSession.upsert({
      where: { id: `ws_day_${dayAgo}` },
      update: {
        wordsAdded: words,
        durationMinutes: durationMin,
      },
      create: {
        id: `ws_day_${dayAgo}`,
        userId: user.id,
        documentId: docBab1.id,
        startedAt: new Date(sessionDate.getTime() - durationMin * 60 * 1000),
        endedAt: sessionDate,
        durationMinutes: durationMin,
        wordsAdded: words,
      },
    });
  }

  // 10. Archived Items (8 items matching exact design screenshot)
  const archives = [
    { id: 'arch_1', title: 'Laporan Praktik Kependidikan', fileType: 'PDF', category: 'Completed', dateLabel: 'Completed • 15 Des 2026' },
    { id: 'arch_2', title: 'Makalah PPKn - Pancasila', fileType: 'DOCX', category: 'Completed', dateLabel: 'Completed • 30 Nov 2026' },
    { id: 'arch_3', title: 'Proposal Penelitian', fileType: 'DOCX', category: 'Writing', dateLabel: 'Completed • 20 Okt 2026' },
    { id: 'arch_4', title: 'Catatan Bimbingan Skripsi', fileType: 'PDF', category: 'Writing', dateLabel: 'Archived • 12 Okt 2026' },
    { id: 'arch_5', title: 'Jurnal Review - Literasi Digital', fileType: 'DOCX', category: 'Writing', dateLabel: 'Archived • 5 Sep 2026' },
    { id: 'arch_6', title: 'Materi & RPP PK', fileType: 'PDF', category: 'Completed', dateLabel: 'Archived • 30 Agu 2026' },
    { id: 'arch_7', title: 'PLK UNY Mengabdi (Laporan Akhir)', fileType: 'DOCX', category: 'Completed', dateLabel: 'Archived • 15 Agu 2026' },
    { id: 'arch_8', title: 'Referensi Skripsi', fileType: 'FOLDER', category: 'Projects', dateLabel: '12 files • Updated 10 Agu 2026' },
  ];

  for (const item of archives) {
    await prisma.archivedItem.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        itemType: item.fileType,
        metadata: {
          category: item.category,
          dateLabel: item.dateLabel,
        },
      },
      create: {
        id: item.id,
        userId: user.id,
        title: item.title,
        itemType: item.fileType,
        metadata: {
          category: item.category,
          dateLabel: item.dateLabel,
        },
      },
    });
  }

  console.log('✅ StudyFlow database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
