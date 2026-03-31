using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;

namespace MauiApp1.ViewModels
{
    /// <summary>
    /// ViewModel for MainPage.
    /// In .NET MAUI, a ViewModel plays the same role as a custom hook in React:
    /// it encapsulates state and logic so the view (XAML) stays clean and declarative.
    /// </summary>
    public class MainPageViewModel : INotifyPropertyChanged
    {
        private int _count;
        private string _counterButtonText = "Click me";

        public string CounterButtonText
        {
            get => _counterButtonText;
            private set => SetProperty(ref _counterButtonText, value);
        }

        public ICommand IncrementCounterCommand { get; }

        public MainPageViewModel()
        {
            IncrementCounterCommand = new Command(OnCounterClicked);
        }

        private void OnCounterClicked()
        {
            _count++;
            CounterButtonText = _count == 1
                ? $"Clicked {_count} time"
                : $"Clicked {_count} times";

            SemanticScreenReader.Announce(CounterButtonText);
        }

        public event PropertyChangedEventHandler? PropertyChanged;

        private void SetProperty<T>(ref T backingStore, T value, [CallerMemberName] string propertyName = "")
        {
            if (EqualityComparer<T>.Default.Equals(backingStore, value))
                return;

            backingStore = value;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
