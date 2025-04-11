import MoneyTrackerClient from '../components/money-tracker-client';

export default function Home() {
  return (
    <main className="container mx-auto p-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Money Saver App</h1>
        <p className="text-muted-foreground mt-2">Track your finances with ease</p>
      </div>
      
      <MoneyTrackerClient />
    </main>
  );
}


