# Shikho Quarter in Review

A React-based interactive application that generates personalized quarter review presentations for Shikho students. The app creates beautiful, animated slides showcasing student performance data including attendance, quiz results, model test scores, study streaks, and study time analytics.

## Features

- **Interactive Slides**: Beautiful, animated presentation slides with Bengali text support
- **Student Data Integration**: Connects to Shikho's student API for real-time data
- **Performance Analytics**: Visualizes attendance, quiz performance, model test results, and study patterns
- **Responsive Design**: Modern UI with Tailwind CSS and smooth animations
- **Share Functionality**: Students can share their review results
- **Route Protection**: Secure navigation with data validation
- **Loading States**: Elegant loading animations with Bengali text

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript support

## Project Structure

```
src/
├── components/          # React components for each slide
├── context/            # React Context for global state management
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── utils/              # Utility functions and mock data
├── config/             # Environment configuration
└── assets/             # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ShikhoQInReview
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Development Mode

The application runs in development mode by default, using mock student data. This allows for:

- Testing without API dependencies
- Simulated API delays for realistic UX testing
- Easy development and debugging

To switch to production mode (API integration), see the [Deployment Instructions](./DEPLOYMENT_INSTRUCTIONS.md).

## Mock Students

The application includes three mock students for testing:

- **তাসনিম হাসান** (ID: 1937) - High engagement student
- **রাফি আক্তার** (ID: 4821) - Moderate engagement student  
- **মাহি রহমান** (ID: 5704) - Low engagement student

## Application Flow

1. **Test Page**: Select a student to begin
2. **Welcome Slide**: Personalized greeting with student info
3. **Live Class Slide**: Attendance and engagement metrics
4. **Model Test Slide**: Test completion and performance data
5. **Quiz Performance Slide**: Quiz results and accuracy
6. **Streak Tracker Slide**: Study streak achievements
7. **Study Time Slide**: Monthly study time breakdown
8. **Final Congrats Slide**: Overall score and celebration

## Data Architecture

The application uses React Context for global state management:

- **Single API Call**: Data is fetched once when a student is selected
- **Context Sharing**: All slides access the same data without additional requests
- **Route Protection**: Ensures data availability before rendering slides
- **Error Handling**: Comprehensive error states with retry functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is proprietary to Shikho. All rights reserved.

## Support

For technical support or questions, please contact the development team.
