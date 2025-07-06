import { BuddyType } from '../store/types';

export class Buddy implements BuddyType {
  type: 'extension' | 'xmpp' | 'contact' | 'group';
  identity: string;
  CallerIDName: string;
  ExtNo: string;
  MobileNumber?: string;
  ContactNumber1?: string;
  ContactNumber2?: string;
  lastActivity: string; // ISO timestamp
  Desc: string;
  Email: string;
  jid?: string;
  devState: string;
  presence: string;
  missed: number;
  IsSelected: boolean;
  imageObjectURL: string;
  presenceText: string;
  EnableDuringDnd: boolean;
  EnableSubscribe: boolean;
  SubscribeUser: string;
  AllowAutoDelete: boolean;
  Pinned: boolean;

  constructor(
    type: 'extension' | 'xmpp' | 'contact' | 'group',
    identity: string,
    CallerIDName: string = '',
    ExtNo: string,
    MobileNumber: string = '',
    ContactNumber1: string = '',
    ContactNumber2: string = '',
    lastActivity: string = new Date().toISOString(),
    Desc: string = '',
    Email: string = '',
    jid: string = '',
    EnableDuringDnd: boolean = false,
    EnableSubscribe: boolean = false,
    subscription: string | null = null,
    AllowAutoDelete: boolean = false,
    Pinned: boolean = false,
  ) {
    this.type = type;
    this.identity = identity;
    this.CallerIDName = CallerIDName;
    this.ExtNo = ExtNo;
    this.MobileNumber = MobileNumber;
    this.ContactNumber1 = ContactNumber1;
    this.ContactNumber2 = ContactNumber2;
    this.lastActivity = lastActivity;
    this.Desc = Desc;
    this.Email = Email;
    this.jid = jid;
    this.devState = 'dotOffline';
    this.presence = 'Unknown';
    this.missed = 0;
    this.IsSelected = false;
    this.imageObjectURL = '';
    this.presenceText = 'lang.default_status'; //TODO #SH
    this.EnableDuringDnd = EnableDuringDnd;
    this.EnableSubscribe = EnableSubscribe;
    this.SubscribeUser = subscription ? subscription : ExtNo;
    this.AllowAutoDelete = AllowAutoDelete;
    this.Pinned = Pinned;
  }
}
