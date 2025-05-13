import { CircleSlash2 } from "lucide-react";
import Text from "./ui/text";

export default function Nodata() {
    return (
        <section className="w-full h-full  py-16">
            <div className="w-full flex flex-row items-center justify-center">
                <div className="w-full flex flex-col  items-center justify-center gap-5 py-3 px-2">
                    <CircleSlash2 size={80} />
                    <Text format='h1' weight='normal' classNameStyle='text-xl'>Aucune commande trouvée !</Text>
                </div>
            </div>
        </section>
    )
}
