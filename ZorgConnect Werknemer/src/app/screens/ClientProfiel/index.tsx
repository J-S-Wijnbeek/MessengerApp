import { ArrowLeft, Phone, Mail, MapPin, Calendar, User, FileText, MessageCircle } from "lucide-react";
import { useClientProfiel } from "./hooks/useClientProfiel";

export default function ClientProfiel() {
  const { client, goBack, navigateToChat } = useClientProfiel();

  if (!client) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center max-w-[390px] mx-auto">
        <div className="text-gray-500">Client niet gevonden</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-[390px] mx-auto">
      {/* Header */}
      <div className="bg-[#1DC6B4] px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={goBack}
          className="text-white hover:opacity-80"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="text-white font-medium text-center flex-1">
          Client Profiel
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-b from-[#1DC6B4]/10 to-transparent px-4 py-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
            <span className="text-gray-600 font-medium text-2xl">
              {client.initials}
            </span>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-1">
            {client.name}
          </h2>
          <p className="text-sm text-gray-500">Client sinds {client.since}</p>
        </div>
      </div>

      {/* Contact Buttons */}
      <div className="px-4 pb-4 flex gap-3">
        <button
          onClick={() => navigateToChat(client.id)}
          className="flex-1 bg-[#1DC6B4] text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1AB39F] transition-colors"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-medium">Bericht</span>
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
          <Phone size={18} />
          <span className="text-sm font-medium">Bellen</span>
        </button>
      </div>

      {/* Information Sections */}
      <div className="px-4 space-y-4">
        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <User size={18} className="text-[#1DC6B4]" />
            <h3 className="font-medium text-gray-900">Persoonlijke gegevens</h3>
          </div>
          <div className="space-y-3">
            <InfoRow icon={Calendar} label="Geboortedatum" value={client.dateOfBirth} />
            <InfoRow icon={MapPin} label="Adres" value={client.address} />
            <InfoRow icon={Phone} label="Telefoon" value={client.phone} />
            <InfoRow icon={Mail} label="Email" value={client.email} />
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-[#1DC6B4]" />
            <h3 className="font-medium text-gray-900">Medische informatie</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Diagnose</div>
              <div className="text-sm text-gray-900">{client.diagnosis}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Hoofdbehandelaar</div>
              <div className="text-sm text-gray-900">
                {client.primaryCareWorker}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Notities</div>
              <div className="text-sm text-gray-900">{client.notes}</div>
            </div>
          </div>
        </div>

        {/* Last Contact */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={18} className="text-[#1DC6B4]" />
            <h3 className="font-medium text-gray-900">Laatste contact</h3>
          </div>
          <div className="text-sm text-gray-600">{client.lastContact}</div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-8"></div>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 mb-0.5">{label}</div>
        <div className="text-sm text-gray-900 break-words">{value}</div>
      </div>
    </div>
  );
}
