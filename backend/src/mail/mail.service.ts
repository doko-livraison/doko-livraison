import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendNewMissionToManager(mission: any, client: any) {
    const managerEmail = process.env.MANAGER_EMAIL;
    if (!managerEmail || !process.env.SMTP_USER) return;

    const types = mission.deliveryTypes?.join(' + ') || mission.deliveryType;
    await this.transporter.sendMail({
      from: `"Doko Livraison" <${process.env.SMTP_USER}>`,
      to: managerEmail,
      subject: `🚛 Nouvelle mission Doko – ${types}`,
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
          <div style="background: #1A3A8C; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #F5C200; margin: 0; font-size: 24px;">DOKO LIVRAISON</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0;">Nouvelle demande reçue</p>
          </div>
          <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1A3A8C;">Détails de la mission</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; color: #888;">Client</td><td style="padding: 8px; font-weight: bold;">${client.firstName} ${client.lastName}</td></tr>
              <tr style="background:#fff"><td style="padding: 8px; color: #888;">Téléphone</td><td style="padding: 8px;">${client.phone || 'Non renseigné'}</td></tr>
              <tr><td style="padding: 8px; color: #888;">Email</td><td style="padding: 8px;">${client.email}</td></tr>
              <tr style="background:#fff"><td style="padding: 8px; color: #888;">Type(s)</td><td style="padding: 8px; font-weight: bold; color: #1A3A8C;">${types}</td></tr>
              <tr><td style="padding: 8px; color: #888;">Départ</td><td style="padding: 8px;">📍 ${mission.pickupAddress}</td></tr>
              <tr style="background:#fff"><td style="padding: 8px; color: #888;">Arrivée</td><td style="padding: 8px;">🏁 ${mission.deliveryAddress}</td></tr>
              <tr><td style="padding: 8px; color: #888;">Poids estimé</td><td style="padding: 8px;">${mission.estimatedWeightKg ? mission.estimatedWeightKg + ' kg' : 'Non renseigné'}</td></tr>
              <tr style="background:#fff"><td style="padding: 8px; color: #888;">Description</td><td style="padding: 8px;">${mission.description || '—'}</td></tr>
              <tr><td style="padding: 8px; color: #888;">Manutention</td><td style="padding: 8px;">${mission.needsHandling ? '✅ Oui' : 'Non'}</td></tr>
              <tr style="background:#fff"><td style="padding: 8px; color: #888;">Escaliers</td><td style="padding: 8px;">${mission.hasStairs ? `✅ Oui (étage ${mission.floorNumber || '?'})` : 'Non'}</td></tr>
              <tr><td style="padding: 8px; color: #888;">Fragile</td><td style="padding: 8px;">${mission.fragile ? '⚠️ Oui' : 'Non'}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background: #FFF8E1; border-radius: 8px; border-left: 4px solid #F5C200;">
              <p style="margin: 0; color: #B8860B; font-weight: bold;">⏰ Action requise : vérifier et attribuer cette mission</p>
            </div>
          </div>
        </div>
      `,
    }).catch(err => console.error('[Mail] Erreur envoi gestionnaire:', err));
  }

  async sendMissionConfirmationToClient(mission: any, clientEmail: string, clientName: string) {
    if (!process.env.SMTP_USER) return;
    const types = mission.deliveryTypes?.join(' + ') || mission.deliveryType;

    await this.transporter.sendMail({
      from: `"Doko Livraison" <${process.env.SMTP_USER}>`,
      to: clientEmail,
      subject: `✅ Votre demande Doko a bien été reçue`,
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
          <div style="background: #1A3A8C; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #F5C200; margin: 0;">DOKO LIVRAISON</h1>
          </div>
          <div style="padding: 24px;">
            <h2>Bonjour ${clientName},</h2>
            <p>Votre demande de livraison a bien été reçue et transmise aux transporteurs disponibles.</p>
            <div style="background: #f0f4ff; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p><strong>Type :</strong> ${types}</p>
              <p><strong>Départ :</strong> ${mission.pickupAddress}</p>
              <p><strong>Arrivée :</strong> ${mission.deliveryAddress}</p>
            </div>
            <p>Vous serez notifié dès qu'un transporteur accepte votre demande.</p>
            <p style="color: #888; font-size: 13px;">L'équipe Doko Livraison – Guyane</p>
          </div>
        </div>
      `,
    }).catch(err => console.error('[Mail] Erreur envoi client:', err));
  }
}
