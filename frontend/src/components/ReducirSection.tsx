import { Button } from "./ui/button";

export default function ReducirSection(){


    return (
        <div className="bg-[#0F8354] py-[122px] flex flex-col gap-14 text-white ">

            <h2 className="font-righteous font-normal text-7xl leading-[24px] tracking-[0] text-center align-middle">Empieza a Reducir tu CO₂ Hoy</h2>
            <p className="font-sans font-light text-4xl leading-[35px] tracking-[0] text-center max-w-7xl mx-auto ">
            Cada compra cuenta. Conoce tu impacto en tiempo real con productos verificados que cuidan del planeta y de las generaciones futuras.


        
            </p>
        

            <Button
                  size="lg"
                  variant="outline"
                  className="text-[18px] md:text-[32px] border-2 border-[#006CFF] rounded-none text-[#006CFF]
                   hover:bg-white  w-fit mx-auto hover:text-[#006CFF] font-righteous font-medium py-7 px-32 shadow-xl"
                >
                  Iniciar Sesión
                </Button>
        </div>
    )
}