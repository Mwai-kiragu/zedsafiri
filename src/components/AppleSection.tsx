import React from 'react';
import { Apple } from 'lucide-react';
import { Card } from '@/components/ui/card';
import appleLogo from '@/assets/apple-logo.png';

const AppleSection = () => {
  return (
    <section className="w-full py-8">
      <div className="flex flex-col items-center gap-8">
        <h2 className="text-3xl font-semibold text-foreground text-center">
          Apple Integration
        </h2>
        
        <div className="flex flex-wrap justify-center gap-8">
          {/* Apple Icon from Lucide */}
          <Card className="p-8 flex flex-col items-center gap-4 min-w-60">
            <Apple size={64} className="text-foreground" />
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Apple Icon</h3>
              <p className="text-muted-foreground">
                Lucide React Apple icon
              </p>
            </div>
          </Card>

          {/* Apple Logo */}
          <Card className="p-8 flex flex-col items-center gap-4 min-w-60">
            <img 
              src={appleLogo} 
              alt="Apple Logo" 
              className="w-16 h-16 object-contain"
            />
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Apple Logo</h3>
              <p className="text-muted-foreground">
                Generated Apple logo
              </p>
            </div>
          </Card>

          {/* Apple Icon Variants */}
          <Card className="p-8 flex flex-col items-center gap-4 min-w-60">
            <div className="flex gap-4 items-center">
              <Apple size={32} className="text-foreground" />
              <Apple size={48} className="text-primary" />
              <Apple size={64} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Icon Sizes</h3>
              <p className="text-muted-foreground">
                Different sizes and colors
              </p>
            </div>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="w-full max-w-4xl p-6">
          <h3 className="text-xl font-semibold mb-4">Usage Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Lucide Apple Icon:</h4>
              <code className="text-sm bg-muted p-2 rounded block">
                {`import { Apple } from 'lucide-react';

<Apple size={24} className="text-primary" />`}
              </code>
            </div>
            <div>
              <h4 className="font-medium mb-2">Apple Logo Image:</h4>
              <code className="text-sm bg-muted p-2 rounded block">
                {`import appleLogo from '@/assets/apple-logo.png';

<img src={appleLogo} alt="Apple" className="w-8 h-8" />`}
              </code>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AppleSection;