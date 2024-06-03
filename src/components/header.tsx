import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <div className=" justify-betweenpx-4 flex h-[45px] w-full flex-row items-end py-2 pl-2">
            <Link href="https://www.prosights.co/" target="_blank">
                <Image
                    src="/logo/logo_with_text.jpg"
                    alt="Pro Sights Logo"
                    title="ProSights Website"
                    height={28}
                    width={113}
                />
            </Link>
        </div>
    );
}
