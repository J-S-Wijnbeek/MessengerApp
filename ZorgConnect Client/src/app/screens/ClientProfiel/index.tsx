import { TealHeader } from "../../components/TealHeader";
import { ClientBottomNav } from "../../components/ClientBottomNav";
import { SectionBar } from "../../components/SectionBar";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User } from "lucide-react";
import { useClientProfiel } from "./hooks/useClientProfiel";

export default function ClientProfiel() {
  const { goBack } = useClientProfiel();

  return (
    <div className="min-h-screen bg-white pb-20 w-full mx-auto">
      <div className="bg-[#F5A623] text-white text-center py-4 px-4 flex items-center justify-center relative">
        <button
          onClick={goBack}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-1"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">Mijn Profiel</h1>
      </div>

      {/* Profile Header */}
      <div className="px-4 py-6 border-b border-gray-100 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
          <span className="text-gray-500 text-4xl font-medium">PH</span>
        </div>
        <div className="font-bold text-2xl text-gray-900 mb-1">Peter Hendriks</div>
        <div className="text-sm text-gray-600">Cliënt sinds 2023</div>
      </div>

      {/* Personal Information */}
      <SectionBar title="Persoonlijke gegevens" />
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <User size={20} className="text-gray-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Volledige naam</div>
            <div className="text-gray-900">Peter Hendriks</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-gray-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Geboortedatum</div>
            <div className="text-gray-900">15 maart 1985</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <User size={20} className="text-gray-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">BSN</div>
            <div className="text-gray-900">123-45-6789</div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <SectionBar title="Contactgegevens" />
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Mail size={20} className="text-gray-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">E-mailadres</div>
            <div className="text-gray-900">demo@client.nl</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Phone size={20} className="text-gray-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Telefoonnummer</div>
            <div className="text-gray-900">06 1234 5678</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <MapPin size={20} className="text-gray-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Adres</div>
            <div className="text-gray-900">Voorbeeldstraat 123</div>
            <div className="text-gray-900">1234 AB Amsterdam</div>
          </div>
        </div>
      </div>

      {/* Care Information */}
      <SectionBar title="Zorggegevens" />
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <User size={20} className="text-gray-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Hoofdbehandelaar</div>
            <div className="text-gray-900">Sophie van der Berg</div>
            <div className="text-sm text-gray-500">Begeleider</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <User size={20} className="text-gray-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Zorgteam</div>
            <div className="text-gray-900">4 gekoppelde zorgmedewerkers</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-gray-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Laatste afspraak</div>
            <div className="text-gray-900">Gisteren, 11:00</div>
            <div className="text-sm text-gray-500">Medicatie bespreking</div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <SectionBar title="Noodcontact" />
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <User size={20} className="text-gray-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Naam</div>
            <div className="text-gray-900">Maria Hendriks</div>
            <div className="text-sm text-gray-500">Echtgenote</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Phone size={20} className="text-gray-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Telefoonnummer</div>
            <div className="text-gray-900">06 9876 5432</div>
          </div>
        </div>
      </div>

      <ClientBottomNav />
    </div>
  );
}
