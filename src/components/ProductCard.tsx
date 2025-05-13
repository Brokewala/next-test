import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import { RiMicrosoftLoopFill } from 'react-icons/ri';
import { ProduitType } from '../lib/queryClient';

// import LikeButton from './LikeButton';

interface ProductCardProps {
  product: ProduitType;
  className?: string;
  showPrevPrice?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  product,
  className,
  showPrevPrice = false,
}) => {
  return (
    <div
      className={`transitionEffect relative rounded-2xl p-3 shadow-md ${className}`}
    >
      <div className="h-[250px] w-full overflow-hidden rounded-2xl lg:h-[220px] 2xl:h-[300px]">
        {/* {product.justIn && (
          <div className="absolute left-6 top-0 rounded-b-lg bg-primary px-3 py-2 text-sm uppercase text-white shadow-md">
            Just In!
          </div>
        )}
        <LikeButton className="absolute right-2 top-2" /> */}
        {product.image ?
          <Link
            className="h-[250px] w-full lg:h-[220px] overflow-hidden"
            href={`/nos-produits/${product.id}`}
          >
            <Image
              src={product.image ? product.image[0] : "/user.png"}
              alt={`${product.nom} cover photo`}
              width={200}
              height={200}
              className="h-full w-full object-cover object-bottom"
            />
          </Link>
          :
          <div className="w-full h-64 rounded-lg flex justify-center items-center bg-zinc-50">
            <RiMicrosoftLoopFill className="text-7xl text-primary animate-pulse" />
          </div>
        }
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{product.nom.length > 20 ? `${product.nom.slice(0, 20)}...` : product.nom}</h3>
          <p
            className={`text-neutral-500 ${showPrevPrice ? 'block' : 'hidden'
              } text-sm line-through`}
          >
            {product.prix} KMF
          </p>
        </div>

        <div className="flex items-center justify-between mt-6">
          {/* <p className="text-sm text-neutral-500">{product.}</p> */}
          <p className="text-md font-bold text-cyan-700">
            {product.prix} KMF
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
