using System.Text.Json;
using Microsoft.JSInterop;
using Rational.Interfaces;

namespace Rational.Services
{
    public class LocalStorageService : ILocalStorageService
    {
        private readonly IJSRuntime _jsRuntime;

        public LocalStorageService(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }

        public async Task SaveAsync<T>(string key, T data)
        {
            string json = JsonSerializer.Serialize(data);

            await _jsRuntime.InvokeVoidAsync(
                "localStorage.setItem",
                key,
                json);
        }

        public async Task<T?> LoadAsync<T>(string key)
        {
            string? json = await _jsRuntime.InvokeAsync<string>(
                "localStorage.getItem",
                key);

            if (string.IsNullOrWhiteSpace(json))
                return default;

            return JsonSerializer.Deserialize<T>(json);
        }

        public async Task RemoveAsync(string key)
        {
            await _jsRuntime.InvokeVoidAsync(
                "localStorage.removeItem",
                key);
        }
    }
}
