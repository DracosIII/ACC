import React from 'react';
import { Shield, X } from 'lucide-react';

interface RgpdModalProps {
  onClose: () => void;
}

const RgpdModal: React.FC<RgpdModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 transition-opacity">
      <div className="glass-panel w-full max-w-3xl max-h-[85vh] rounded-2xl flex flex-col shadow-2xl border border-cyan-500/20 relative overflow-hidden transform-gpu">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/20">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Politique de Confidentialité & RGPD (Belgique)
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" title="Fermer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-gray-300 space-y-6 text-sm leading-relaxed custom-scrollbar overscroll-contain">
          
          <section>
            <h3 className="text-white font-bold text-lg mb-2">1. Cadre Légal (Autorité de Protection des Données)</h3>
            <p>
              Conformément à la <strong>Loi belge du 30 juillet 2018 relative à la protection des personnes physiques à l'égard des traitements de données à caractère personnel</strong> et au <strong>Règlement Général sur la Protection des Données (RGPD - Règlement (UE) 2016/679)</strong>, MediMonitor Pro s'engage à garantir la plus grande sécurité et confidentialité des données de ses patients et de son personnel.
            </p>
          </section>

          <section>
            <h3 className="text-white font-bold text-lg mb-2">2. Traitement des données de santé (Article 9 RGPD)</h3>
            <p>
              En tant que plateforme hébergeant des données de santé (fréquence cardiaque, détection de chutes, alertes médicales), ces données sont considérées comme <strong>sensibles</strong>. Leur traitement est strictement limité :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-cyan-500">
              <li>Au personnel médical et paramédical directement assigné au patient concerné (obligation de secret professionnel).</li>
              <li>Dans le but exclusif du suivi médical, préventif ou de la sauvegarde des intérêts vitaux du patient.</li>
              <li>A aucun moment ces données ne sont partagées, vendues à des tiers, ou utilisées à d'autres fins.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-white font-bold text-lg mb-2">3. Droits des patients et du personnel</h3>
            <p>
              Conformément aux directives de l'<strong>APD (Autorité de protection des données belge)</strong>, chaque personne enregistrée dans l'application dispose des droits suivants :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-cyan-500">
              <li><strong>Droit d'accès :</strong> Obtenir une copie de ses propres données (historique médical, informations de compte).</li>
              <li><strong>Droit de rectification :</strong> Modifier toute information inexacte ou obsolète.</li>
              <li><strong>Droit à l'effacement (droit à l'oubli) :</strong> Demander la suppression de ses données dans la limite des obligations légales de conservation des dossiers médicaux (selon la législation belge sur les droits du patient).</li>
              <li><strong>Droit à la limitation du traitement :</strong> Suspendre temporairement le suivi dans les cas prévus par la loi.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-white font-bold text-lg mb-2">4. Hébergement et Sécurité (DPO)</h3>
            <p>
              L'ensemble des données est traité et hébergé de manière sécurisée (chiffrement SHA-256 pour les mots de passe, et connexions HTTPS encryptées). Les accès sont cloisonnés par rôles ("Super Administrateur", "Administrateur", "Employé", "Patient"). En cas de fuite de données avérée, une notification sera envoyée à l'APD dans les 72 heures légales, ainsi qu'aux personnes concernées si le risque est élevé.
            </p>
          </section>

          <section>
            <h3 className="text-white font-bold text-lg mb-2">5. Exercice des droits</h3>
            <p>
              Pour exercer ces droits, vous pouvez contacter directement le Délégué à la Protection des Données (DPO) de l'établissement via votre interface "Employé", ou par demande écrite à l'administration de l'établissement. En cas de litige, vous avez le droit d'introduire une plainte auprès de <strong>l'Autorité de protection des données (APD)</strong> : Rue de la Presse 35, 1000 Bruxelles (contact@apd-gba.be).
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 shrink-0 bg-black/20 flex justify-end">
          <button 
            onClick={onClose} 
            className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-[0_0_10px_rgba(8,145,178,0.3)]"
          >
            J'ai compris et j'accepte
          </button>
        </div>

      </div>
    </div>
  );
};

export default RgpdModal;