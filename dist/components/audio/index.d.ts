import { AudioHTMLAttributes } from 'react';
interface AudioProps extends AudioHTMLAttributes<HTMLAudioElement> {
    lineNumber: string | number;
    type?: 'transfer' | 'conference';
}
export declare const Audio: ({ lineNumber, type, ...rest }: AudioProps) => import("react/jsx-runtime").JSX.Element;
export {};
