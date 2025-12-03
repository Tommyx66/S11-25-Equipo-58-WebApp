"use client";
import Image from "next/image";

export default function SellosSection() {
  return (
    <div className="mb-20 mx-auto overflow-hidden ">
      <div className=" w-full mx-auto   container   ">
        <div className="  mb-12 flex flex-col md:flex-row gap-10  container  w-full justify-start  ">
          <div className=" flex items-start pt-4 gap-2  ">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-[25px] w-[25px] rounded-full"
                style={{
                  backgroundColor: `rgba(16, 185, 129, ${0.2 + i * 0.1})`,
                }}
              />
            ))}
          </div>
          <div>
            <h2 className="mb-4 font-righteous text-[#1A1A1B] text-4xl  font-light text-balance md:text-5xl">
            Sellos de confianza
            </h2>
            <p className="max-w-4xl text-2xl font-regular font-sans text-[#1A1A1B] text-pretty">
            Trabajamos exclusivamente con productos certificados por las principales organizaciones ambientales

            </p>
          </div>
        </div>


        <div className="relative w-full overflow-hidden">
       
      </div>

     

       
      </div>
      <div className="flex md:gap-20 mt-5 gap-10 mx-10 w-full animate-scroll items-center">
        
        <Image
          src="/img/sellos/1.svg"
          alt="EU Ecolabel logo"
          width={178}
          height={203}
          className="shrink-0 w-[90px] h-[101px] md:w-[178px] md:h-[203px]"
        />
        <Image
          src="/img/sellos/2.svg"
          alt="Fairtrade Logo"
          width={212}
          height={2177}
          className="shrink-0 w-[106px] h-[109px] md:w-[212px] md:h-[217px]"
        />
        <Image
          src="/img/sellos/3.svg"
          alt="Carbon neutral Logo"
          width={298}
          height={173}
          className="shrink-0 w-[148px] h-[85px] md:w-[298px] md:h-[173px]"
        />
        <Image
          src="/img/sellos/4.svg"
          alt="ORganic Textile Logo"
          width={267}
          height={251}
          className="shrink-0 w-[133px] h-[125px] md:w-[267px] md:h-[251px]"
        />
        <Image
          src="/img/sellos/5.svg"
          alt="Lab Global Logo"
          width={223}
          height={223}
          className="shrink-0 w-[111px] h-[111px] md:w-[223px] md:h-[223px]"
        />
        <Image
          src="/img/sellos/6.svg"
          alt="CNIC Logo"
          width={244}
          height={233}
          className="shrink-0 w-[122px] h-[116px] md:w-[244px] md:h-[233px]"
        />
        <Image
          src="/img/sellos/7.svg"
          alt="Carbon Trust Logo"
          width={258}
          height={171}
          className="shrink-0 w-[149px] h-[85px] md:w-[258px] md:h-[171px]"
        />
         <Image
          src="/img/sellos/1.svg"
          alt="Unity Logo"
          width={178}
          height={203}
          className="shrink-0 w-[90px] h-[101px] md:w-[178px] md:h-[203px]"
        />
        <Image
          src="/img/sellos/2.svg"
          alt="JavaScript Logo"
          width={212}
          height={2177}
          className="shrink-0 w-[106px] h-[109px] md:w-[212px] md:h-[217px]"
        />
        <Image
          src="/img/sellos/3.svg"
          alt="Vue Logo"
          width={298}
          height={173}
          className="shrink-0 w-[148px] h-[85px] md:w-[298px] md:h-[173px]"
        />
        <Image
          src="/img/sellos/4.svg"
          alt="Python Logo"
          width={267}
          height={251}
          className="shrink-0 w-[133px] h-[125px] md:w-[267px] md:h-[251px]"
        />
        <Image
          src="/img/sellos/5.svg"
          alt="Angular Logo"
          width={223}
          height={223}
          className="shrink-0 w-[111px] h-[111px] md:w-[223px] md:h-[223px]"
        />
        <Image
          src="/img/sellos/6.svg"
          alt="Laravel Logo"
          width={244}
          height={233}
          className="shrink-0 w-[122px] h-[116px] md:w-[244px] md:h-[233px]"
        />
        <Image
          src="/img/sellos/7.svg"
          alt="Java Logo"
          width={258}
          height={171}
          className="shrink-0 w-[149px] h-[85px] md:w-[258px] md:h-[171px]"
        />
         <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 60s linear infinite;
          width: max-content;
          
        }
      `}</style>
      </div>
    </div>
  );
}
