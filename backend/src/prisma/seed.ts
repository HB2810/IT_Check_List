import { PrismaClient, RoleType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Resetting database to FRESH ZERO state for deployment...');

  // Clear existing mock data
  await prisma.incidentTimeline.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.assetServiceLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.asset.deleteMany();

  // 1. Create Departments
  const departmentsData = [
    { name: 'Server Room', code: 'SRV-01', floor: 'Basement', wing: 'Core' },
    { name: 'OPD (Outpatient)', code: 'OPD-01', floor: '1st Floor', wing: 'North' },
    { name: 'IPD (Inpatient)', code: 'IPD-01', floor: '2nd Floor', wing: 'South' },
    { name: 'Operation Theatre (OT)', code: 'OT-01', floor: '3rd Floor', wing: 'West' },
    { name: 'Radiology & Imaging', code: 'RAD-01', floor: 'Ground Floor', wing: 'East' },
    { name: 'Intensive Care Unit (ICU)', code: 'ICU-01', floor: '3rd Floor', wing: 'East' },
    { name: 'Billing & Accounts', code: 'BIL-01', floor: 'Ground Floor', wing: 'Main Lobby' },
    { name: 'Reception & Helpdesk', code: 'REC-01', floor: 'Ground Floor', wing: 'Entrance' },
    { name: 'Administration', code: 'ADM-01', floor: '4th Floor', wing: 'Executive' },
    { name: 'CSSD (Sterilization)', code: 'CSD-01', floor: 'Basement', wing: 'Utility' },
  ];

  const departmentsMap: Record<string, string> = {};
  for (const dept of departmentsData) {
    const d = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept
    });
    departmentsMap[d.code] = d.id;
  }

  // 2. Create Asset Categories
  const categoriesData = [
    { name: 'Server & Rack Infrastructure', icon: 'Server', description: 'Rack servers, hypervisors, NAS storage' },
    { name: 'Network Switch & Routing', icon: 'Network', description: 'Managed Layer 3 switches, core routers, fiber backbones' },
    { name: 'Firewall & Security Gateways', icon: 'Shield', description: 'Next-Gen Firewall, IPS/IDS appliances' },
    { name: 'Hospital Printers & Scanners', icon: 'Printer', description: 'Thermal prescription printers, barcode scanners, MFP' },
    { name: 'CCTV & Biometric Access', icon: 'Camera', description: 'IP Security Cameras, Biometric attendance readers' },
    { name: 'Medical Workstations', icon: 'Monitor', description: 'DICOM viewers, OT monitors, Billing PCs' },
    { name: 'UPS & Power Systems', icon: 'Zap', description: 'Online double-conversion UPS, battery banks' },
    { name: 'Software & Licenses', icon: 'Code', description: 'HIS software, Windows Server licenses, Antivirus subscriptions' },
  ];

  for (const cat of categoriesData) {
    await prisma.assetCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat
    });
  }

  // 3. Create Core Authenticated Users
  const headPasswordHash = await bcrypt.hash('Stavya1234', 10);
  const execPasswordHash = await bcrypt.hash('Mohit1234', 10);

  await prisma.user.upsert({
    where: { username: 'vatsal_IT_Head' },
    update: { passwordHash: headPasswordHash },
    create: {
      username: 'vatsal_IT_Head',
      email: 'vatsal@stavyaspine.com',
      passwordHash: headPasswordHash,
      fullName: 'Vatsal (IT Head)',
      role: RoleType.IT_HEAD,
      departmentId: departmentsMap['SRV-01'],
      phone: '+91 98765 43210'
    }
  });

  await prisma.user.upsert({
    where: { username: 'Mohit_IT' },
    update: { passwordHash: execPasswordHash },
    create: {
      username: 'Mohit_IT',
      email: 'mohit@stavyaspine.com',
      passwordHash: execPasswordHash,
      fullName: 'Mohit (IT Executive)',
      role: RoleType.IT_EXECUTIVE,
      departmentId: departmentsMap['OPD-01'],
      phone: '+91 98765 43211'
    }
  });

  console.log('Fresh zero state seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
