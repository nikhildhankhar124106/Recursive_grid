import './globals.css';

export const metadata = {
    title: 'Rec Grid',
    description: 'A recursive grid game',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
