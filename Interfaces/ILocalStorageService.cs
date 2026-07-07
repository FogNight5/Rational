namespace Rational.Interfaces
{
    public interface ILocalStorageService
    {
        Task SaveAsync<T>(string key, T data);

        Task<T?> LoadAsync<T>(string key);

        Task RemoveAsync(string key);
    }
}
