    import { Users, Building2, ArrowRight} from 'lucide-react';
    import { useNavigate } from 'react-router-dom';

    export default function RegisterType () {
        const navigate = useNavigate();

        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-blue-600 mb-2">UKMStartUp</h1>
                <p className="text-gray-600">Pilih jenis akaun anda</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => navigate('community')}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left group"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                    <Users className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Komuniti UKM</h3>
                  <p className="text-gray-600 mb-6">
                    Untuk pelajar, pensyarah, dan staf UKM yang ingin berkongsi idea startup
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold">
                    Teruskan
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => navigate ('company')}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left group"
                >
                  <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                    <Building2 className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Syarikat / Industri</h3>
                  <p className="text-gray-600 mb-6">
                    Untuk syarikat dan rakan industri yang mencari idea dan bakat baharu
                  </p>
                  <div className="flex items-center text-indigo-600 font-semibold">
                    Teruskan
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>

              <p className="text-center mt-8 text-gray-600">
                Sudah mempunyai akaun?{' '}
                <a href="/login" className="text-blue-600 font-semibold hover:underline">
                  Log Masuk
                </a>
              </p>
            </div>
          </div>
        );
      }



      