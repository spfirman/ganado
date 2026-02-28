import { Contact } from './contact.entity';
export declare enum ProviderType {
    BUYER = "BUYER",
    TRANSPORTER = "TRANSPORTER",
    VET = "VET",
    OTHER = "OTHER",
    PROVIDER = "PROVIDER"
}
export declare class Provider {
    id: string;
    idTenant: string;
    name: string;
    nit: string;
    type: ProviderType;
    address: string;
    contactPersonId: string;
    contactPerson: Contact;
    created_at: Date;
    updated_at: Date;
}
