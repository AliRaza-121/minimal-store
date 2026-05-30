import { ProductSkeleton } from '@/components/Skeleton'

export default function ShopLoading() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-12">
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">Browse Collection</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-light mt-4">Shop All</h1>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-6" />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-8 border-b border-dark-border">
           <div className="h-10 w-24 bg-dark-card border border-dark-border animate-pulse" />
           <div className="h-10 w-64 bg-dark-card border border-dark-border animate-pulse" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
