# Padrao de code style

O projeto YouInControl usa chaves de abertura na mesma linha da declaracao em codigo C#, no estilo K&R.

## Correto

```csharp
if (condition) {
    DoSomething();
}
else {
    DoAnotherThing();
}
```

```csharp
public class Example {
    public void Execute() {
        DoSomething();
    }
}
```

## Incorreto

```csharp
if (condition)
{
    DoSomething();
}
else
{
    DoAnotherThing();
}
```

```csharp
public class Example
{
    public void Execute()
    {
        DoSomething();
    }
}
```

A chave de fechamento continua em linha propria. Novos codigos gerados, alteracoes futuras e contribuicoes devem seguir este padrao.
