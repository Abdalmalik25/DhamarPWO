import { readFileSync, writeFileSync } from 'fs';

const path = 'G:\\App25\\ThamarOfficeWeb\\src\\pages\\HomePage.tsx';
let content = readFileSync(path, 'utf8');

const insert = `
          {/* صورة تنظيم المواقف */}
          <ScrollReveal delay={50}>
            <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <img
                src="/docs/parkingorgn1.png"
                alt="تنظيم المواقف"
                className="w-full h-56 sm:h-72 object-cover"
                loading="lazy"
              />
              <div className="bg-white p-4">
                <div className="flex items-center gap-2 text-gov-600">
                  <ParkingCircle size={16} />
                  <span className="text-sm font-medium">مشروع تنظيم المواقف</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
`;

content = content.replace(
  '</ScrollReveal>\n          <div className="grid md:grid-cols-2 gap-8">',
  '</ScrollReveal>' + insert + '\n          <div className="grid md:grid-cols-2 gap-8">'
);

writeFileSync(path, content, 'utf8');
console.log('done');
