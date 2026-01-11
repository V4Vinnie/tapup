"""
Example usage of the Content Screening Agent
"""

from agent import ContentScreeningAgent


def main():
    # Example 1: Screen for Python programming content
    print("Example: Python Programming Content Screening\n")
    
    agent = ContentScreeningAgent(
        target_skill="Python Programming",
        sources=[
            "https://realpython.com/feed/",
            "https://dev.to/feed/tag/python",
            # Add more sources as needed
        ]
    )
    
    # Preview content first (optional)
    print("Previewing content...")
    preview = agent.preview_content(max_items=5)
    for item in preview:
        print(f"- {item['title']}")
        print(f"  URL: {item['url']}")
        print()
    
    # Run screening and create microlearnings
    print("Screening for new content and creating microlearnings...\n")
    results = agent.screen_and_create_microlearnings(max_items_per_source=5)
    
    # Print results
    print("\n=== Screening Results ===")
    print(f"Target Skill: {results['target_skill']}")
    print(f"Discovered: {results['discovered']} items")
    print(f"New Items: {results['discovered'] - results['already_processed']}")
    print(f"Relevant Items: {results['processed']}")
    print(f"Filtered Out: {results['filtered_out']}")
    print(f"Microlearnings Created: {results['microlearnings_created']}")
    
    if results['microlearnings']:
        print("\n=== Created Microlearnings ===")
        for ml in results['microlearnings']:
            print(f"- {ml['title']}")
            print(f"  File: {ml['filepath']}")
    
    if results['errors']:
        print("\n=== Errors ===")
        for error in results['errors']:
            print(f"- {error}")
    
    # Example 2: Run continuously (uncomment to use)
    # print("\nRunning continuously (checking every 6 hours)...")
    # agent.run_continuously(check_interval_hours=6)


if __name__ == "__main__":
    main()

